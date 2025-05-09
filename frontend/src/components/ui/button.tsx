import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-transparent text-primary-foreground hover:bg-primary/10",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                primary:
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                new: "bg-[#d8282f] rounded-[14px] text-center text-white text-xs font-normal leading-[14.40px] hover:bg-[#e23239]",
                "outline-custom":
                    "rounded-[14px] border border-[#d8282f] p-[14px_auto] shadow text-center text-black text-xs font-normal leading-[14.40px] hover:border-[#ff5a61] hover:bg-[#fdfdfd]",
                "outline-gray":
                    "rounded-[14px] border border-[#eeeeee] p-[14px_auto] shadow text-center text-[#bcbcbc] text-xs font-normal leading-[14.40px] hover:border-[#dbdbdb]",
                delete: "h-11 rounded-[14px] border border-[#eeeeee] p-[14px_auto] shadow text-center text-[#bcbcbc] hover:text-[#8a8a8a] text-xs font-normal leading-[14.40px] hover:bg-gray-100",
            },
            size: {
                default: "h-10 px-4 py-2",
                new: "w-full h-[34px] py-[9px] px-[19px]",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-[14px] py-[14px] px-[20px]",
                icon: "h-10 w-10",
                sidebar: "w-[130px] h-[26px]",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    widthFull?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { className, variant, size, widthFull, asChild = false, ...props },
        ref
    ) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(
                    buttonVariants({ variant, size, className }),
                    widthFull && "w-full"
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
