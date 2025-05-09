import TrashIcon from "/public/icons/trash-white.svg";
import { addDays, addMonths, format, isAfter, isBefore } from "date-fns";
import { Locale } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { useDateRangeFilter } from "@/providers/dateRangeProvider";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "./button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "./select";

interface CalendarDateRangeProps {
	selected?: { from?: Date; to?: Date };
	onSelect?: (range: { from?: Date; to?: Date }) => void;
	locale: Locale;
}

// Generate months and years arrays for the calendar
const MONTHS = Array.from({ length: 12 }, (_, i) => ({
	value: i,
	label: format(new Date(2021, i), "MMMM", { locale: ru })
}));

const YEARS = Array.from({ length: 201 }, (_, i) => ({
	value: 1900 + i,
	label: (1900 + i).toString()
}));

export function CalendarDateRange({
	selected,
	onSelect,
	locale = ru
}: CalendarDateRangeProps) {
	const { dateRange, setDateRange } = useDateRangeFilter();

	const [leftMonth, setLeftMonth] = React.useState<Date>(() =>
		selected?.from ? selected.from : new Date()
	);
	const [rightMonth, setRightMonth] = React.useState<Date>(() =>
		selected?.to ? selected.to : addMonths(new Date(), 1)
	);

	const modifiers = {
		inRange: (date: Date) => {
			return (
				(selected?.to &&
					selected?.from &&
					isAfter(date, addDays(selected.from, -1)) &&
					isBefore(date, addDays(selected.to, 1))) ||
				false
			);
		}
	};

	const handleDayClickLeft = (day: Date | undefined) => {
		if (day) {
			const range = { from: day, to: selected?.to || undefined };
			onSelect?.(range);
		}
	};

	const handleDayClickRight = (day: Date | undefined) => {
		if (day) {
			const range = { from: selected?.from || undefined, to: day };
			onSelect?.(range);
		}
	};

	const handleClear = () => {
		onSelect?.({ from: undefined, to: undefined });
		setLeftMonth(new Date());
		setRightMonth(addMonths(new Date(), 1));
		setDateRange({ from: null, to: null });
	};

	return (
		<div className="grid grid-flow-row">
			<div className="grid grid-flow-col grid-cols-2">
				{/* Левый календарь */}
				<DayPicker
					mode="single"
					month={leftMonth}
					onMonthChange={setLeftMonth}
					onSelect={handleDayClickLeft}
					selected={selected?.from}
					locale={locale}
					showOutsideDays={true}
					modifiers={modifiers}
					modifiersClassNames={{
						inRange: "bg-[#f6f6f6] text-[#bcbcbc]"
					}}
					classNames={{
						root: "p-2.5 rounded-tl-[10px] rounded-bl-[10px]",
						months:
							"flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
						caption:
							"h-[22px] flex justify-center relative items-center bg-[#f6f6f6] rounded-md",
						caption_label:
							"text-black text-[10px] font-medium leading-3 capitalize",
						nav: "space-x-1 flex items-center",
						nav_button: cn(
							"w-3.5 h-3.5 origin-top-left justify-center items-center inline-flex"
						),
						nav_button_previous: "absolute left-1",
						nav_button_next: "absolute right-1",
						nav_icon: "h-3.5 w-3.5 text-[#d8282f]",
						table: "w-full mt-2.5",
						head_row: "grid grid-cols-7",
						head_cell:
							"w-6 h-3 text-center text-[#bcbcbc] text-[10px] font-normal leading-3 capitalize",
						row: "flex w-full mt-1",
						cell: "w-6 h-6 p-0 text-center text-black text-[10px] font-medium leading-3 relative focus-within:relative focus-within:z-20",
						day: cn(
							buttonVariants({ variant: "ghost" }),
							"grid items-center justify-center w-6 h-6 text-[10px] font-medium leading-3 p-0 py-[6px] hover:[aria-selected]:bg-black aria-selected:opacity-100"
						),
						day_selected:
							"bg-primary text-primary-foreground hover:w-6 hover:h-6 focus:bg-primary focus:text-primary-foreground",
						day_outside:
							"day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
						day_today: "bg-accent text-accent-foreground",
						day_disabled: "text-muted-foreground opacity-50",
						day_hidden: "invisible"
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
											setLeftMonth(newDate);
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
												setLeftMonth(newDate);
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
												setLeftMonth(newDate);
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
											setLeftMonth(newDate);
										}}
										className="flex items-center justify-center"
									>
										<ChevronRight className="h-4 w-4 text-[#d8282f]" />
									</button>
								</div>
							);
						}
					}}
				/>
				<DayPicker
					mode="single"
					month={rightMonth}
					onMonthChange={setRightMonth}
					onSelect={handleDayClickRight}
					selected={selected?.to}
					locale={locale}
					showOutsideDays={true}
					modifiers={modifiers}
					modifiersClassNames={{
						inRange: "bg-[#f6f6f6] text-[#bcbcbc]"
					}}
					classNames={{
						root: "p-2.5 rounded-tr-[10px] rounded-br-[10px]",
						months:
							"flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
						caption:
							"h-[22px] flex justify-center relative items-center bg-[#f6f6f6] rounded-md",
						caption_label:
							"text-black text-[10px] font-medium leading-3 capitalize",
						nav: "space-x-1 flex items-center",
						nav_button: cn(
							"w-3.5 h-3.5 origin-top-left justify-center items-center inline-flex"
						),
						nav_button_previous: "absolute left-1",
						nav_button_next: "absolute right-1",
						nav_icon: "h-3.5 w-3.5 text-[#d8282f]",
						table: "w-full mt-2.5",
						head_row: "grid grid-cols-7",
						head_cell:
							"w-6 h-3 text-center text-[#bcbcbc] text-[10px] font-normal leading-3 capitalize",
						row: "flex w-full mt-1",
						cell: "w-6 h-6 p-0 text-center text-black text-[10px] font-medium leading-3 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
						day: cn(
							buttonVariants({ variant: "ghost" }),
							"grid items-center justify-center w-6 h-6 text-[10px] font-medium leading-3 p-0 py-[6px] hover:[aria-selected]:bg-black aria-selected:opacity-100"
						),
						day_selected:
							"bg-primary text-primary-foreground hover:w-6 hover:h-6 focus:bg-primary focus:text-primary-foreground",
						day_outside:
							"day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
						day_today: "bg-accent text-accent-foreground",
						day_disabled: "text-muted-foreground opacity-50",
						day_hidden: "invisible"
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
											setRightMonth(newDate);
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
												setRightMonth(newDate);
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
												setRightMonth(newDate);
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
											setRightMonth(newDate);
										}}
										className="flex items-center justify-center"
									>
										<ChevronRight className="h-4 w-4 text-[#d8282f]" />
									</button>
								</div>
							);
						}
					}}
				/>
			</div>
			<div>
				<Button
					variant="ghost"
					className="group ml-2.5 mb-2.5 w-[84px] h-[34px] py-[9px] text-[#bcbcbc] hover:text-[#8a8a8a] text-[10px] font-medium font-['Onest'] leading-[10px]"
					onClick={handleClear}
				>
					<div className="grid grid-flow-col grid-cols-[12px_1fr] gap-x-1.5 items-center">
						<TrashIcon className="h-3 w-3 stroke-[#bcbcbc] group-hover:stroke-[#8a8a8a]" />
						<span>Очистить</span>
					</div>
				</Button>
			</div>
		</div>
	);
}
