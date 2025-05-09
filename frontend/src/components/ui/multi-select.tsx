"use client";

import ArrowDownIcon from "/public/icons/arrow-down.svg";
import TickSquare from "/public/icons/tick-square.svg";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

interface MultiSelectProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	options: {
		label: string;
		value: string;
		icon?: React.ComponentType<{ className?: string }>;
	}[];
	onValueChange: (value: string[]) => void;
	defaultValue?: string[];
	placeholder?: string;
	maxCount?: number;
	variant?: "primary" | "form" | "filter";
	label?: string;
	className?: string;
}

export const MultiSelect = React.forwardRef<
	HTMLButtonElement,
	MultiSelectProps
>(
	(
		{
			options,
			onValueChange,
			variant = "primary",
			defaultValue = [],
			placeholder = "Выбрать",
			maxCount,
			label,
			className,
			...props
		},
		ref
	) => {
		const [selectedValues, setSelectedValues] =
			React.useState<string[]>(defaultValue);
		const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
		const [searchValue, setSearchValue] = React.useState("");

		const handleInputKeyDown = (
			event: React.KeyboardEvent<HTMLInputElement>
		) => {
			if (event.key === "Backspace" && !event.currentTarget.value) {
				const newSelectedValues = [...selectedValues];
				newSelectedValues.pop();
				setSelectedValues(newSelectedValues);
				onValueChange(newSelectedValues);
			}
		};

		const toggleOption = (option: string) => {
			const newSelectedValues = selectedValues.includes(option)
				? selectedValues.filter(value => value !== option)
				: [...selectedValues, option];
			setSelectedValues(newSelectedValues);
			onValueChange(newSelectedValues);
		};

		const handleClear = () => {
			setSelectedValues([]);
			onValueChange([]);
		};

		const handleTogglePopover = () => {
			setIsPopoverOpen(prev => !prev);
		};

		const filteredOptions = options.filter(option => {
			if (!searchValue) return true;
			return option.label.toLowerCase().includes(searchValue.toLowerCase());
		});

		return (
			<Popover
				open={isPopoverOpen}
				onOpenChange={setIsPopoverOpen}
			>
				<PopoverTrigger asChild>
					<button
						ref={ref}
						{...props}
						onClick={handleTogglePopover}
						className={cn(
							"group flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:ring-none focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
							variant === "form" &&
								"bg-white border-none h-3 [data-aria-hidden]:border-[#bcbcbc] hover:border-[#dbdbdb]",
							variant === "primary" &&
								"grid grid-flow-col grid-cols-[auto_16px] items-center w-full h-11 p-[7px_10px_5px] bg-white rounded-[10px] border border-[#eeeeee] hover:border-[#dbdbdb] [data-aria-hidden]:border-[#bcbcbc]",
							variant === "filter" &&
								"h-6 bg-[#f6f6f6] hover:bg-[#ececec] p-[6px_10px] rounded-[10px] border-none [data-aria-hidden]:border-none",
							className
						)}
					>
						{variant === "primary" ? (
							<div className="grid grid-flow-row gap-1">
								<div className="h-3 text-[#bcbcbc] text-left text-[10px] font-normal leading-3">
									{label}
								</div>
								<span className="h-4 text-left text-black text-xs font-normal leading-[14.40px]">
									{selectedValues.length > 0
										? selectedValues.length === 1
											? options.find(o => o.value === selectedValues[0])?.label
											: `${selectedValues.length} выбрано`
										: placeholder}
								</span>
							</div>
						) : variant === "filter" ? (
							<span className="text-black text-[10px] font-normal leading-3">
								{selectedValues.length > 0
									? selectedValues.length === 1
										? options.find(o => o.value === selectedValues[0])?.label
										: `${selectedValues.length} выбрано`
									: placeholder}
							</span>
						) : (
							<span className="text-black text-[10px] font-medium leading-3">
								{selectedValues.length > 0
									? selectedValues.length === 1
										? options.find(o => o.value === selectedValues[0])?.label
										: `${selectedValues.length} выбрано`
									: placeholder}
							</span>
						)}
						<ArrowDownIcon
							className={cn(
								"w-3 h-3 justify-center items-center inline-flex stroke-[#d8282f] transition-transform duration-200 group-data-[state=open]:rotate-180"
							)}
						/>
					</button>
				</PopoverTrigger>
				<PopoverContent
					className="w-auto p-[3px]"
					align="start"
				>
					<Command>
						<Input
							type="text"
							value={searchValue}
							onChange={e => setSearchValue(e.target.value)}
							onKeyDown={handleInputKeyDown}
							placeholder="Поиск..."
							className="w-full h-8 py-[auto] pl-2 pr-4 border-none rounded-sm text-black placeholder:text-[#a19494] text-[12px] leading-[3.44] font-medium shadow-sm focus-visible:ring-0 focus-visible:ring-inset focus-visible:ring-offset-0"
						/>
						<CommandList>
							<CommandGroup className="space-y-[3px]">
								{filteredOptions ? (
									filteredOptions.map(option => {
										const isSelected = selectedValues.includes(option.value);
										return (
											<div
												key={option.value}
												className="relative w-full h-5 py-[auto] px-[7px] hover:bg-[#f6f6f6] cursor-pointer select-none items-center rounded-md outline-none grid grid-cols-[1fr,_auto]"
												onClick={() => toggleOption(option.value)}
											>
												<p className="h-3 text-black text-[10px] font-medium leading-3">
													{option.label}
												</p>
												<div
													className={cn(
														"w-3.5 h-3.5 rounded-[5px] border-[#BCBCBC] hover:border-[#8a8a8a] flex items-center justify-center",
														isSelected
															? "bg-black text-white"
															: "bg-white border border-[#BCBCBC]"
													)}
												>
													{isSelected && (
														<TickSquare className="w-3.5 h-3.5 stroke-white stroke-[1.5]" />
													)}
												</div>
											</div>
										);
									})
								) : (
									<CommandEmpty>Ничего не найдено.</CommandEmpty>
								)}
							</CommandGroup>
							{selectedValues.length > 0 && (
								<>
									<CommandGroup>
										<Button
											variant="outline-custom"
											size="sm"
											className="h-8"
											onClick={handleClear}
											widthFull
										>
											Очистить
										</Button>
									</CommandGroup>
								</>
							)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		);
	}
);

MultiSelect.displayName = "MultiSelect";
