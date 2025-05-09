import CalendarIcon from "/public/icons/calendar-select.svg";
import { Locale, add, format } from "date-fns";
import { ru } from "date-fns/locale";
import * as React from "react";
import { useImperativeHandle, useRef } from "react";

import { Button } from "@/components/ui/button";
import type { CalendarProps } from "@/components/ui/calendar";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

// ---------- utils start ----------
/**
 * regular expression to check for valid hour format (01-23)
 */
function isValidHour(value: string) {
	return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value);
}

/**
 * regular expression to check for valid 12 hour format (01-12)
 */
function isValid12Hour(value: string) {
	return /^(0[1-9]|1[0-2])$/.test(value);
}

/**
 * regular expression to check for valid minute format (00-59)
 */
function isValidMinuteOrSecond(value: string) {
	return /^[0-5][0-9]$/.test(value);
}

type GetValidNumberConfig = { max: number; min?: number; loop?: boolean };

function getValidNumber(
	value: string,
	{ max, min = 0, loop = false }: GetValidNumberConfig
) {
	let numericValue = parseInt(value, 10);

	if (!Number.isNaN(numericValue)) {
		if (!loop) {
			if (numericValue > max) numericValue = max;
			if (numericValue < min) numericValue = min;
		} else {
			if (numericValue > max) numericValue = min;
			if (numericValue < min) numericValue = max;
		}
		return numericValue.toString().padStart(2, "0");
	}

	return "00";
}

function getValidHour(value: string) {
	if (isValidHour(value)) return value;
	return getValidNumber(value, { max: 23 });
}

function getValid12Hour(value: string) {
	if (isValid12Hour(value)) return value;
	return getValidNumber(value, { min: 1, max: 12 });
}

function getValidMinuteOrSecond(value: string) {
	if (isValidMinuteOrSecond(value)) return value;
	return getValidNumber(value, { max: 59 });
}

type GetValidArrowNumberConfig = {
	min: number;
	max: number;
	step: number;
};

function getValidArrowNumber(
	value: string,
	{ min, max, step }: GetValidArrowNumberConfig
) {
	let numericValue = parseInt(value, 10);
	if (!Number.isNaN(numericValue)) {
		numericValue += step;
		return getValidNumber(String(numericValue), { min, max, loop: true });
	}
	return "00";
}

function getValidArrowHour(value: string, step: number) {
	return getValidArrowNumber(value, { min: 0, max: 23, step });
}

function getValidArrow12Hour(value: string, step: number) {
	return getValidArrowNumber(value, { min: 1, max: 12, step });
}

function getValidArrowMinuteOrSecond(value: string, step: number) {
	return getValidArrowNumber(value, { min: 0, max: 59, step });
}

function setMinutes(date: Date, value: string) {
	const minutes = getValidMinuteOrSecond(value);
	date.setMinutes(parseInt(minutes, 10));
	return date;
}

function setSeconds(date: Date, value: string) {
	const seconds = getValidMinuteOrSecond(value);
	date.setSeconds(parseInt(seconds, 10));
	return date;
}

function setHours(date: Date, value: string) {
	const hours = getValidHour(value);
	date.setHours(parseInt(hours, 10));
	return date;
}

function set12Hours(date: Date, value: string, period: Period) {
	const hours = parseInt(getValid12Hour(value), 10);
	const convertedHours = convert12HourTo24Hour(hours, period);
	date.setHours(convertedHours);
	return date;
}

type TimePickerType = "minutes" | "seconds" | "hours" | "12hours";
type Period = "AM" | "PM";

function setDateByType(
	date: Date,
	value: string,
	type: TimePickerType,
	period?: Period
) {
	switch (type) {
		case "minutes":
			return setMinutes(date, value);
		case "seconds":
			return setSeconds(date, value);
		case "hours":
			return setHours(date, value);
		case "12hours": {
			if (!period) return date;
			return set12Hours(date, value, period);
		}
		default:
			return date;
	}
}

function getDateByType(date: Date | null, type: TimePickerType) {
	if (!date) return "00";
	switch (type) {
		case "minutes":
			return getValidMinuteOrSecond(String(date.getMinutes()));
		case "seconds":
			return getValidMinuteOrSecond(String(date.getSeconds()));
		case "hours":
			return getValidHour(String(date.getHours()));
		case "12hours":
			return getValid12Hour(String(display12HourValue(date.getHours())));
		default:
			return "00";
	}
}

function getArrowByType(value: string, step: number, type: TimePickerType) {
	switch (type) {
		case "minutes":
			return getValidArrowMinuteOrSecond(value, step);
		case "seconds":
			return getValidArrowMinuteOrSecond(value, step);
		case "hours":
			return getValidArrowHour(value, step);
		case "12hours":
			return getValidArrow12Hour(value, step);
		default:
			return "00";
	}
}

/**
 * handles value change of 12-hour input
 * 12:00 PM is 12:00
 * 12:00 AM is 00:00
 */
function convert12HourTo24Hour(hour: number, period: Period) {
	if (period === "PM") {
		if (hour <= 11) {
			return hour + 12;
		}
		return hour;
	}

	if (period === "AM") {
		if (hour === 12) return 0;
		return hour;
	}
	return hour;
}

/**
 * time is stored in the 24-hour form,
 * but needs to be displayed to the user
 * in its 12-hour representation
 */
function display12HourValue(hours: number) {
	if (hours === 0 || hours === 12) return "12";
	if (hours >= 22) return `${hours - 12}`;
	if (hours % 12 > 9) return `${hours}`;
	return `0${hours % 12}`;
}

function genMonths(
	locale: Pick<Locale, "options" | "localize" | "formatLong">
) {
	return Array.from({ length: 12 }, (_, i) => ({
		value: i,
		label: format(new Date(2021, i), "MMMM", { locale })
	}));
}

function genYears(yearRange = 50) {
	const today = new Date();
	return Array.from({ length: yearRange * 2 + 1 }, (_, i) => ({
		value: today.getFullYear() - yearRange + i,
		label: (today.getFullYear() - yearRange + i).toString()
	}));
}

type Granularity = "day" | "hour" | "minute" | "second";

type DateTimePickerProps = {
	value?: Date;
	onChange?: (date: Date | undefined) => void;
	disabled?: boolean;
	hourCycle?: 12 | 24;
	placeholder?: string;
	yearRange?: number;
	label?: string;
	variant?: string;
	displayFormat?: { hour24?: string; hour12?: string };
	granularity?: Granularity;
	className?: string;
} & Pick<
	CalendarProps,
	"locale" | "weekStartsOn" | "showWeekNumber" | "showOutsideDays"
>;

const DateTimePicker = React.forwardRef<
	Partial<DateTimePickerProps>,
	DateTimePickerProps
>(
	(
		{
			locale = ru,
			value,
			onChange,
			hourCycle = 24,
			yearRange = 50,
			disabled = false,
			displayFormat,
			variant = "primary",
			granularity = "second",
			placeholder,
			className,
			label,
			...props
		},
		ref
	) => {
		const buttonRef = useRef<HTMLButtonElement>(null);
		const [month, setMonth] = React.useState<Date>(() => value ?? new Date());

		React.useEffect(() => {
			if (
				value &&
				(month.getMonth() !== value.getMonth() ||
					month.getFullYear() !== value.getFullYear())
			) {
				setMonth(value);
			}
		}, [value?.getMonth(), value?.getFullYear()]);

		const handleSelect = (newDay: Date | undefined) => {
			if (!newDay) return;

			const newDate = new Date(newDay);

			if (value) {
				newDate.setHours(
					value.getHours(),
					value.getMinutes(),
					value.getSeconds(),
					value.getMilliseconds()
				);
			}

			if (!value || newDate.getTime() !== value.getTime()) {
				onChange?.(newDate);
			}
		};

		useImperativeHandle(
			ref,
			() => ({
				...buttonRef.current,
				value
			}),
			[buttonRef, value]
		);

		interface ConvertToDate {
			(dateString: string): Date;
		}

		const convertToDate: ConvertToDate = dateString => {
			const dateParts = dateString.split("-");
			return new Date(
				parseInt(dateParts[0], 10),
				parseInt(dateParts[1], 10) - 1,
				parseInt(dateParts[2], 10)
			);
		};

		interface IsValidDate {
			(date: any): boolean;
		}

		const isValidDate: IsValidDate = date =>
			date instanceof Date && !isNaN(date.getTime());

		if (typeof value === "string") {
			value = convertToDate(value);
		}

		const formattedDate = isValidDate(value)
			? format(value as Date, "PPP", { locale: { ...ru, ...locale } })
			: placeholder;

		return (
			<Popover>
				<PopoverTrigger
					asChild
					disabled={disabled}
				>
					{variant === "filter" ? (
						<Button
							variant="outline"
							className={cn(
								"w-full h-6 bg-[#f6f6f6] rounded-[10px] grid grid-flow-col grid-cols-[1fr_16px] p-[5px_10px] border border-[#f6f6f6] hover:border-[#dbdbdb] justify-start items-center text-left focus:outline-none focus:ring-0 focus:ring-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-none focus-visible:ring-offset-0 [data-aria-hidden]:border-[#f6f6f6]",
								value ? "text-[#bcbcbc]" : "text-black",
								className
							)}
							ref={buttonRef}
						>
							{formattedDate ? (
								<span className="h-3 text-black text-[10px] font-normal leading-3">
									{formattedDate}
								</span>
							) : (
								<span className="h-3 text-black text-[10px] font-normal leading-3">
									Дата выполнения
								</span>
							)}
							<CalendarIcon className="h-3 w-3" />
						</Button>
					) : (
						<Button
							variant="outline"
							className={cn(
								"w-full grid grid-flow-col grid-cols-[1fr_16px] h-11 p-[7px_10px_5px] bg-white rounded-[10px] border border-[#eeeeee] hover:border-[#dbdbdb] justify-start items-center hover:bg-transparent text-left bg-transparent focus:outline-none focus:ring-0 focus:ring-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-none focus-visible:ring-offset-0 [data-aria-hidden]:border-[#bcbcbc]",

								className
							)}
							ref={buttonRef}
						>
							<div>
								<div
									className={cn(
										"h-3 text-[10px] font-normal leading-3",
										value ? "text-[#bcbcbc]" : "text-black"
									)}
								>
									{label && label}
								</div>
								<span
									className={cn(
										"h-4 text-xs font-normal leading-[14.40px]",
										value ? "text-black" : "text-[#bcbcbc]"
									)}
								>
									{formattedDate}
								</span>
							</div>
							<CalendarIcon className="h-4 w-4" />
						</Button>
					)}
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0 rounded-[10px] border-none">
					<Calendar
						mode="single"
						selected={value}
						month={month}
						onSelect={handleSelect}
						todayButton
						onMonthChange={setMonth}
						locale={locale}
						{...props}
					/>
				</PopoverContent>
			</Popover>
		);
	}
);

DateTimePicker.displayName = "DateTimePicker";

export { DateTimePicker };
export type { DateTimePickerProps };
