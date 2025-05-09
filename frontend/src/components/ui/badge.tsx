import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
				destructive:
					"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
				outline: "text-foreground",
				"project-status": "text-white",
				"project-type": "grid items-center justify-center bg-[#F6F6F6]",
				"project-actions":
					"text-center justify-start text-[8px] font-medium leading-[9.60px]",
				green:
					"grid items-center justify-center bg-[#80b566] border-transparent text-white text-[8px] font-medium leading-[9.60px]",
				blue: "grid items-center justify-center bg-[#6160ce] border-transparent text-white text-[8px] font-medium leading-[9.60px]",
				gray: "grid items-center justify-center bg-[#bcbcbc] border-transparent text-white text-[8px] font-medium leading-[9.60px]",
				black:
					"grid items-center justify-center bg-black border-transparent text-white text-[8px] font-medium leading-[9.60px]",
				red: "grid items-center justify-center bg-[#d8282f] border-transparent text-white text-[10px] font-medium leading-3",
				gray_7e:
					"grid items-center justify-center bg-[#7E7E7E] border-transparent text-white text-[10px] font-medium leading-3",
				"yellowish-green":
					"grid items-center justify-center bg-[#85cb64] border-transparent whitespace-nowrap text-white text-[10px] font-medium leading-3",
				"text-yellowish-green":
					"bg-transparent border-transparent whitespace-nowrap text-[#85cb64] text-[10px] font-medium leading-3",
				"text-blue":
					"bg-transparent border-transparent text-[#615fce] text-[10px] font-medium leading-3",
				"text-black":
					"bg-transparent border-transparent whitespace-nowrap text-black text-[10px] font-medium leading-3",
				"text-red":
					"bg-transparent border-transparent text-[#d8282f] text-[10px] font-medium leading-3",
				"border-yellowish-green":
					"bg-transparent border-[#85cb64] whitespace-nowrap text-[#85cb64] text-[10px] font-medium leading-3",
				"border-blue":
					"bg-transparent border-[#615fce] text-[#615fce] text-[10px] font-medium leading-3",
				"border-black":
					"bg-transparent border-black whitespace-nowrap text-black text-[10px] font-medium leading-3",
				"border-red":
					"bg-transparent border-[#d8282f] text-[#d8282f] text-[10px] font-medium leading-3"
			},
			size: {
				"project-actions": "h-[18px] rounded-md",
				task: "w-[60px] h-[18px] rounded-md",
				"project-status":
					"h-6 rounded-lg text-center justify-start text-white text-[10px] font-medium leading-3",
				"project-type":
					"w-[92px] h-6 rounded-lg text-center text-[10px] font-medium leading-3",
				team: "grid items-center justify-center w-[106px] bg-[#f6f6f6] h-6 rounded-lg",
				"project-action-type": "w-auto h-[18px] rounded-lg"
			}
		},
		defaultVariants: {
			variant: "default"
		}
	}
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
	return (
		<div
			className={cn(badgeVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
