import { cn } from "@/lib/utils";

interface InfoFieldProps {
	label?: string;
	value?: string;
	icon?: any;
}

export const InfoField = ({ label, value, icon }: InfoFieldProps) => {
	return (
		<div
			className={cn(
				"bg-[#f6f6f6] rounded-[10px] p-[7px_10px_5px] min-h-11",
				!!icon ? "grid grid-cols-[1fr_auto] gap-x-2 items-center" : ""
			)}
		>
			<div className="space-y-1">
				<p className="text-[#bcbcbc] text-[10px] font-normal leading-3">
					{label}
				</p>
				<p className="text-black text-xs font-normal leading-[14.40px]">
					{value}
				</p>
			</div>
			{icon && <div className="grid justify-self-end">{icon}</div>}
		</div>
	);
};
