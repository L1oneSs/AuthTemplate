"use client";

import { Locale, format } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { Button, buttonVariants } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
	todayButton?: boolean;
};

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

function genYears() {
	// Generate years from 1900 to 2100
	const startYear = 1900;
	const endYear = 2100;
	return Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
		value: startYear + i,
		label: (startYear + i).toString()
	}));
}

// ---------- utils end ----------

// Generate months and years arrays for the calendar
const MONTHS = genMonths(ru);
const YEARS = genYears();

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	onDayClick,
	todayButton = false,
	...props
}: CalendarProps) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			classNames={{
				root: "p-2.5 rounded-[10px] border border-[#dbdbdb] bg-white",
				months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
				caption:
					"h-[22px] flex justify-center relative items-center bg-[#f6f6f6] rounded-[10px]",
				caption_label:
					"text-black text-[10px] font-medium leading-3 capitalize",

				table: "w-full mt-2.5",
				head_row: "grid grid-cols-7",
				head_cell:
					"w-6 h-3 text-center text-[#bcbcbc] text-[10px] font-normal leading-3 capitalize",
				row: "flex w-full mt-1",
				cell: "w-6 h-6 p-0 text-center text-black text-[10px] font-medium leading-3 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
				day: cn(
					buttonVariants({ variant: "ghost" }),
					"grid items-center justify-center w-6 h-6 text-[10px] font-medium leading-3 p-0 py-[6px] font-normal aria-selected:opacity-100"
				),
				day_range_end: "day-range-end",
				day_selected:
					"bg-[#0F172A] text-white hover:bg-[#0F172A] hover:text-white focus:bg-[#0F172A] focus:text-white rounded-[10px]",
				// day_today: "bg-accent text-accent-foreground",
				day_outside:
					"day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
				day_disabled: "text-muted-foreground opacity-50",
				day_range_middle:
					"aria-selected:bg-accent aria-selected:text-accent-foreground",
				day_hidden: "invisible",
				...(todayButton ? { tfoot: "mt-2.5" } : {}),
				...classNames
			}}
			components={{
				Caption: ({ displayMonth }) => {
					const month = format(displayMonth, "LLLL", { locale: ru });
					const year = displayMonth.getFullYear();
					const capitalizedMonth =
						month.charAt(0).toUpperCase() + month.slice(1);

					return (
						<div className="flex justify-between items-center w-full px-1">
							<button
								onClick={() => {
									const newDate = new Date(displayMonth);
									newDate.setMonth(displayMonth.getMonth() - 1);
									props.onMonthChange?.(newDate);
								}}
								className="flex items-center justify-center"
							>
								<ChevronLeft className="h-4 w-4 text-[#d8282f]" />
							</button>

							<div className="flex items-center gap-1">
								<Select
									defaultValue={displayMonth.getMonth().toString()}
									onValueChange={value => {
										const newDate = new Date(displayMonth);
										newDate.setMonth(Number.parseInt(value, 10));
										props.onMonthChange?.(newDate);
									}}
								>
									<SelectTrigger
										className="w-fit h-auto min-h-0 gap-1 border-none p-0"
										isIcon={false}
									>
										<span className="text-black text-[10px] font-medium leading-3 capitalize">
											{capitalizedMonth}
										</span>
									</SelectTrigger>
									<SelectContent>
										{MONTHS.map(monthOption => (
											<SelectItem
												key={monthOption.value}
												value={monthOption.value.toString()}
												variant="primary"
											>
												{monthOption.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Select
									defaultValue={year.toString()}
									onValueChange={value => {
										const newDate = new Date(displayMonth);
										newDate.setFullYear(Number.parseInt(value, 10));
										props.onMonthChange?.(newDate);
									}}
								>
									<SelectTrigger
										className="w-fit h-auto min-h-0 gap-1 border-none p-0"
										isIcon={false}
									>
										<span className="text-black text-[10px] font-medium leading-3">
											{year}
										</span>
									</SelectTrigger>
									<SelectContent>
										{YEARS.map(yearOption => (
											<SelectItem
												key={yearOption.value}
												value={yearOption.value.toString()}
												variant="primary"
											>
												{yearOption.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<button
								onClick={() => {
									const newDate = new Date(displayMonth);
									newDate.setMonth(displayMonth.getMonth() + 1);
									props.onMonthChange?.(newDate);
								}}
								className="flex items-center justify-center"
							>
								<ChevronRight className="h-4 w-4 text-[#d8282f]" />
							</button>
						</div>
					);
				}
			}}
			footer={
				todayButton && (
					<Button
						variant="outline-custom"
						onClick={e => {
							const today = new Date();
							if (onDayClick) {
								onDayClick(today, { selected: true }, e);
							}
						}}
						className="w-[70px] h-6 py-[6px] rounded-[10px] text-black text-[10px] font-medium leading-3"
					>
						Сегодня
					</Button>
				)
			}
			{...props}
		/>
	);
}
Calendar.displayName = "Calendar";

export { Calendar };
