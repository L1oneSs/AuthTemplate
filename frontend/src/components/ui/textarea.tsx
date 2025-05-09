import * as React from "react";

import { cn } from "@/lib/utils";

import { ScrollArea, ScrollBar } from "./scroll-area";

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<
	HTMLTextAreaElement,
	TextareaProps & { variant?: string; label?: string }
>(({ className, ...props }, ref) => {
	return (
		<textarea
			className={cn(
				"flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			ref={ref}
			{...props}
		/>
	);
});
Textarea.displayName = "Textarea";

const TextareaWithLabel = React.forwardRef<
	HTMLTextAreaElement,
	TextareaProps & { label?: string; className?: string }
>(({ label, className, ...props }, ref) => {
	return (
		<ScrollArea className="h-full w-full bg-white rounded-[10px] border border-[#eeeeee] hover:border-[#dbdbdb] p-[7px_10px_0px]">
			<label
				htmlFor="description"
				className="pt-0 mt-0 text-[#bcbcbc] text-[10px] font-normal leading-3"
			>
				{label}
			</label>
			<Textarea
				id="description"
				placeholder="Добавить описание..."
				className={cn(
					"p-0 border-none resize-none focus:ring-0 focus:outline-none text-black text-xs font-normal leading-[14.40px]",
					className
				)}
				ref={ref}
				{...props}
			/>
			<ScrollBar orientation="vertical" />
		</ScrollArea>
	);
});
TextareaWithLabel.displayName = "TextareaWithLabel";

export { Textarea, TextareaWithLabel };
