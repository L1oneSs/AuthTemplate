"use client";

import ArrowLeft from "/public/icons/arrow-left.svg";

import { cn } from "@/lib/utils";

import { Button } from "./button";

interface PaginationProps {
	pageCount: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}

const getPaginationIndices = (pageCount: number, currentPage: number) => {
	const range = [];

	if (currentPage === 1 || pageCount <= 4) {
		range.push(1, 2, 3, 4);
	} else if (currentPage > 1 && currentPage < pageCount - 2) {
		range.push(currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
	} else {
		for (let i = pageCount - 3; i <= pageCount; i++) {
			range.push(i);
		}
	}

	return range.filter(i => i >= 1 && i <= pageCount);
};

export const Pagination = ({
	pageCount,
	currentPage,
	onPageChange
}: PaginationProps) => {
	const paginationIndices = getPaginationIndices(pageCount, currentPage);

	return (
		pageCount > 1 && (
			<div className="grid grid-flow-col grid-cols-[104px_128px] gap-2.5 mt-5 items-center">
				<div className="grid grid-flow-col grid-cols-[30px_64px] gap-2.5">
					<Button
						className="bg-[#f6f6f6] rounded-xl p-2 disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						<ArrowLeft className="h-[14px] w-[14px]" />
					</Button>
					<Button
						variant="new"
						className="rounded-xl py-[9px] px-auto text-white text-[10px] font-medium leading-3"
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === pageCount}
					>
						Больше
					</Button>
				</div>

				<div className="flex items-center space-x-[10px]">
					{paginationIndices.map((page, index) => (
						<Button
							key={index}
							className={cn(
								"rounded-xl p-0 size-5 disabled:opacity-50 disabled:cursor-not-allowed text-center text-[#bcbcbc] text-[9px] font-semibold leading-[10.80px]",
								page === currentPage && "bg-[#f6f6f6] cursor-not-allowed"
							)}
							onClick={() => {
								if (typeof page === "number") {
									onPageChange(page);
								}
							}}
						>
							{page}
						</Button>
					))}
				</div>
			</div>
		)
	);
};
