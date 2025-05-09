"use client";

import ArrowDownIcon from "/public/icons/arrow-down.svg";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronUp, X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Input } from "./input";

const SelectContext = React.createContext<{
	value?: string;
	clearValue?: () => void;
}>({});

const Select = ({
	clearable = true,
	onValueChange,
	value,
	...props
}: SelectPrimitive.SelectProps & {
	clearable?: boolean;
}) => {
	// Use React state to track if the value has been cleared
	const [isCleared, setIsCleared] = React.useState(false);

	// Reset isCleared when value changes
	React.useEffect(() => {
		if (value) {
			setIsCleared(false);
		}
	}, [value]);

	const handleClear = () => {
		if (onValueChange) {
			// Force the value to be cleared and trigger a re-render
			onValueChange("");
			// Mark as cleared to ensure UI updates
			setIsCleared(true);
			// Reset any default value
			if (props.defaultValue) {
				props.defaultValue = "";
			}
		}
	};

	return (
		<SelectContext.Provider value={{ value, clearValue: handleClear }}>
			<div className="relative">
				<SelectPrimitive.Root
					onValueChange={newValue => {
						if (onValueChange) {
							onValueChange(newValue);
							if (newValue) {
								setIsCleared(false);
							}
						}
					}}
					value={isCleared ? "" : value}
					{...props}
				/>
				{clearable && value && !isCleared && (
					<button
						type="button"
						className="absolute right-[10px] top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center rounded-full hover:bg-slate-100 z-10"
						onClick={e => {
							e.stopPropagation();
							handleClear();
						}}
						onMouseDown={e => e.preventDefault()}
						aria-label="Clear selection"
					>
						<X className="h-3 w-3 text-gray-500" />
					</button>
				)}
			</div>
		</SelectContext.Provider>
	);
};
Select.displayName = SelectPrimitive.Root.displayName;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
		variant?: string;
		label?: string;
		isIcon?: boolean;
		placeholder?: string;
	}
>(
	(
		{
			className,
			children,
			variant,
			label,
			isIcon = true,
			placeholder,
			...props
		},
		ref
	) => {
		const { value } = React.useContext(SelectContext);

		// Show the dropdown icon only when there's no value
		const showIcon = !value;
		return (
			<SelectPrimitive.Trigger
				ref={ref}
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
				{...props}
			>
				<>
					{variant === "primary" ? (
						<div className="grid grid-flow-row gap-1">
							<div
								className={cn(
									"h-3 text-[#bcbcbc] text-left text-[10px] font-normal leading-3",
									value ? "text-[#bcbcbc]" : "text-black"
								)}
							>
								{label}
							</div>
							<span
								className={cn(
									"h-4 text-left text-black text-xs font-normal leading-[14.40px] truncate",
									value ? "text-black" : "text-[#bcbcbc]"
								)}
							>
								{children}
							</span>
						</div>
					) : variant === "filter" ? (
						<span className="text-black text-[10px] font-normal leading-3 truncate">
							{children}
						</span>
					) : (
						<span className="text-black text-[10px] font-medium leading-3 truncate">
							{children}
						</span>
					)}
				</>
				<div className="flex items-center gap-1">
					{isIcon && showIcon && (
						<SelectPrimitive.Icon asChild>
							<ArrowDownIcon
								className={cn(
									"w-3 h-3 justify-center items-center inline-flex stroke-[#d8282f] transform transition-transform duration-200 group-data-[state=open]:rotate-180"
								)}
							/>
						</SelectPrimitive.Icon>
					)}
				</div>
			</SelectPrimitive.Trigger>
		);
	}
);

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollUpButton
		ref={ref}
		className={cn(
			"flex cursor-default items-center justify-center py-1",
			className
		)}
		{...props}
	>
		<ChevronUp className="h-4 w-4" />
	</SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollDownButton
		ref={ref}
		className={cn(
			"flex cursor-default items-center justify-center py-1",
			className
		)}
		{...props}
	>
		<ArrowDownIcon className="h-4 w-4" />
	</SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
	SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => {
	const [searchValue, setSearchValue] = React.useState("");

	const filteredChildren = React.Children.toArray(children).filter(
		(child: any) => {
			if (!searchValue) return true;
			if (typeof child.props.children === "string") {
				return child.props.children
					.toLowerCase()
					.includes(searchValue.toLowerCase());
			}
			return false;
		}
	);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		event.stopPropagation();
	};

	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				ref={ref}
				className={cn(
					"relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
					position === "popper" &&
						"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
					className
				)}
				position={position}
				{...props}
			>
				<Input
					type="text"
					value={searchValue}
					onChange={e => setSearchValue(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Поиск..."
					className="w-full py-1.5 pl-2 pr-4 border-none rounded-sm text-black placeholder:text-[#a19494] text-[12px] leading-[3.44] font-medium shadow-sm focus-visible:ring-0 focus-visible:ring-inset focus-visible:ring-offset-0"
				/>
				<SelectScrollUpButton />
				<SelectPrimitive.Viewport
					className={cn(
						"p-1",
						position === "popper" &&
							"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
					)}
				>
					{filteredChildren}
				</SelectPrimitive.Viewport>
				<SelectScrollDownButton />
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Label
		ref={ref}
		className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
		{...props}
	/>
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
		variant?: string;
	}
>(({ className, children, variant, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-4 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			variant === "form" && "text-black text-[10px] leading-3 font-medium",
			variant === "primary" &&
				"text-black text-xs font-normal leading-[14.40px]",
			className
		)}
		{...props}
	>
		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		<span
			className={cn(
				"absolute right-2 flex h-3 w-3 items-center justify-center"
			)}
		>
			<SelectPrimitive.ItemIndicator>
				<Check className="h-3 w-3" />
			</SelectPrimitive.ItemIndicator>
		</span>
	</SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Separator
		ref={ref}
		className={cn("-mx-1 my-1 h-px bg-muted", className)}
		{...props}
	/>
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectScrollUpButton,
	SelectScrollDownButton,
	SelectContent,
	SelectLabel,
	SelectItem,
	SelectSeparator
};
