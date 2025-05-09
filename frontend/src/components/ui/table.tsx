import ArrowDownIcon from "/public/icons/arrow-down.svg";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Checkbox } from "./checkbox";
import { Skeleton } from "./skeleton";

const Table = React.forwardRef<
	HTMLTableElement,
	React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
	<div className="relative w-full overflow-auto">
		<table
			ref={ref}
			className={cn("w-full caption-bottom text-sm", className)}
			{...props}
		/>
	</div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<thead
		ref={ref}
		className={cn("", className)}
		{...props}
	/>
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tbody
		ref={ref}
		className={cn(className)}
		{...props}
	/>
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tfoot
		ref={ref}
		className={cn(
			"border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
			className
		)}
		{...props}
	>
		{props.children}
	</tfoot>
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
	HTMLTableRowElement,
	React.HTMLAttributes<HTMLTableRowElement> & {
		variant?: string;
	}
>(({ className, variant, ...props }, ref) => (
	<tr
		ref={ref}
		className={cn(
			"grid grid-flow-col gap-1.5 transition-colors data-[state=selected]:bg-muted",
			variant === "rounded" &&
				"bg-white rounded-xl border border-[#eeeeee] gap-0",
			className
		)}
		{...props}
	/>
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
	HTMLTableCellElement,
	React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<th
		ref={ref}
		className={cn(
			"pr-[10px] pl-0 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
			className
		)}
		{...props}
	/>
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
	HTMLTableCellElement,
	React.TdHTMLAttributes<HTMLTableCellElement> & {
		subText?: string | React.ReactNode;
		edit?: boolean;
		rowData?: any;
		editComponent?: React.ReactNode;
	}
>(
	(
		{ className, subText, edit = false, editComponent, rowData, ...props },
		ref
	) => (
		<td
			ref={ref}
			className={cn(
				"h-12 p-[10px_17px_9px_10px] [&:has([role=checkbox])]:pr-0 mr-1.5 last:mr-0",
				className
			)}
			{...props}
		>
			<div
				className={cn(
					"w-full",
					edit && "grid grid-flow-col grid-cols-[1fr_auto] gap-[6px]"
				)}
			>
				<div className="grid gap-[3px]">
					<p className="text-black text-xs font-normal leading-[14.40px]">
						{props.children}
					</p>
					{subText && (
						<p className="text-[#bcbcbc] text-[10px] font-normal leading-3">
							{subText}
						</p>
					)}
				</div>

				{edit && editComponent && (
					<div className="grid grid-flow-col grid-cols-2 gap-2.5 items-center">
						{editComponent}
					</div>
				)}
			</div>
		</td>
	)
);
TableCell.displayName = "TableCell";

const TableBodyCell = React.forwardRef<
	HTMLTableCellElement,
	React.TdHTMLAttributes<HTMLTableCellElement> & {
		disabled?: boolean;
		subText?: string | React.ReactNode;
		checkbox?: boolean;
		edit?: boolean;
		rowData?: any;
		variant?: string;
		editComponent?: React.ReactNode;
		truncateComment?: boolean;
	}
>(
	(
		{
			className,
			disabled = false,
			subText,
			checkbox = false,
			edit = false,
			variant,
			rowData,
			editComponent,
			truncateComment = false,
			...props
		},
		ref
	) => (
		<td
			ref={ref}
			className={cn(
				"flex items-center h-[42px] border-b align-middle mr-1.5 last:mr-0 [&:has([role=checkbox])]:pr-0 text-black text-xs font-medium leading-[14.40px] ",
				disabled && "text-[#bcbcbc] text-xs font-medium leading-[14.40px]",
				variant === "project" && "h-[52px]",
				className
			)}
			{...props}
		>
			<div
				className={cn(
					"w-full",
					editComponent && "grid grid-flow-col grid-cols-[1fr_34px] gap-[6px]"
				)}
			>
				<div
					className={cn(
						"grid gap-[3px]",
						checkbox && "flex items-center gap-4"
					)}
				>
					{checkbox && <Checkbox />}
					<div
						className={cn(
							truncateComment && "truncate max-w-full overflow-hidden"
						)}
					>
						{props.children}
						{subText && (
							<div className="text-[#bcbcbc] text-[9px] font-bold leading-[10.80px]">
								{subText}
							</div>
						)}
					</div>
				</div>

				{editComponent && (
					<div className="grid grid-flow-col grid-cols-2 gap-2.5 items-center">
						{editComponent}
					</div>
				)}
			</div>
		</td>
	)
);
TableBodyCell.displayName = "TableBodyCell";

const SkeletonTableCell = React.forwardRef<
	HTMLTableCellElement,
	React.TdHTMLAttributes<HTMLTableCellElement> & {
		subText?: boolean;
		card?: boolean;
		edit?: boolean;
	}
>(
	(
		{ className, subText = false, card = false, edit = false, ...props },
		ref
	) => (
		<td
			ref={ref}
			className={cn(
				"h-12 p-[10px_17px_9px_10px] align-middle [&:has([role=checkbox])]:pr-0 mr-1.5 last:mr-0",
				card && "bg-[#f6f6f6] rounded-[9px]",
				className
			)}
			{...props}
		>
			<div
				className={cn(
					"w-full",
					edit && "grid grid-flow-col grid-cols-[1fr_34px] gap-[6px]"
				)}
			>
				<div className="grid gap-[3px]">
					<Skeleton className="w-[80%] h-[14px] rounded" />
					{subText && (
						<Skeleton className="w-[60%] h-[10px] mt-[3px] rounded" />
					)}
				</div>

				{edit && (
					<div className="grid grid-flow-col grid-cols-2 gap-2.5 items-center">
						<Skeleton className="w-[28px] h-[28px] rounded" />
					</div>
				)}
			</div>
		</td>
	)
);

SkeletonTableCell.displayName = "SkeletonTableCell";

const SkeletonTableBodyCell = React.forwardRef<
	HTMLTableCellElement,
	React.TdHTMLAttributes<HTMLTableCellElement> & {
		checkbox?: boolean;
		edit?: boolean;
		variant?: string;
	}
>(({ className, checkbox = false, edit = false, variant, ...props }, ref) => (
	<td
		ref={ref}
		className={cn(
			"flex items-center h-[42px] border-b align-middle mr-1.5 last:mr-0 text-black text-xs font-medium leading-[14.40px]",
			variant === "project" && "h-[52px]",
			className
		)}
		{...props}
	>
		<div
			className={cn(
				"w-full",
				edit && "grid grid-flow-col grid-cols-[1fr_34px] gap-[6px]"
			)}
		>
			<div
				className={cn("grid gap-[3px]", checkbox && "flex items-center gap-4")}
			>
				{checkbox && <Skeleton className="w-4 h-4 rounded" />}{" "}
				<div>
					<Skeleton className="w-[80%] h-[14px] rounded" />{" "}
					<Skeleton className="w-[60%] h-[10px] mt-[3px] rounded" />{" "}
				</div>
			</div>

			{edit && (
				<div className="grid grid-flow-col grid-cols-2 gap-2.5 items-center">
					<Skeleton className="w-[28px] h-[28px] rounded" />{" "}
				</div>
			)}
		</div>
	</td>
));

SkeletonTableBodyCell.displayName = "SkeletonTableBodyCell";

const TableHeaderCell = React.forwardRef<
	HTMLTableCellElement,
	React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<td
		ref={ref}
		className={cn(
			"h-5 border-b align-middle [&:has([role=checkbox])]:pr-0 mr-1.5 pt-0 pb-[5px] last:mr-0 text-[#bcbcbc] text-[10px] font-medium leading-3",
			className
		)}
		{...props}
	>
		<div className="w-full grid grid-flow-col items-center grid-cols-[1fr_8px]">
			<div>{props.children}</div>
			<div>
				<ArrowDownIcon className="w-2 h-2 justify-center items-center inline-flex stroke-[#BCBCBC]" />
			</div>
		</div>
	</td>
));
TableHeaderCell.displayName = "TableHeaderCell";

const TableCaption = React.forwardRef<
	HTMLTableCaptionElement,
	React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
	<caption
		ref={ref}
		className={cn("mt-4 text-sm text-muted-foreground", className)}
		{...props}
	/>
));
TableCaption.displayName = "TableCaption";

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableBodyCell,
	SkeletonTableCell,
	SkeletonTableBodyCell,
	TableCaption,
	TableHeaderCell
};
