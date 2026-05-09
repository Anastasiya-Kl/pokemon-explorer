"use client";

import { useEffect, useState } from "react";

type PaginationProps = {
	page: number;
	pageSize: number;
	total: number;
	onPageChange: (page: number) => void;
	isLoading?: boolean;
};

export function Pagination({
	page,
	pageSize,
	total,
	onPageChange,
	isLoading = false,
}: PaginationProps) {
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const isPreviousDisabled = page <= 1 || isLoading;
	const isNextDisabled = page >= totalPages || isLoading;
	const [pageInput, setPageInput] = useState(String(page));

	useEffect(() => {
		setPageInput(String(page));
	}, [page]);

	const commitPageInput = () => {
		const parsedPage = Number(pageInput);
		if (!pageInput.trim() || !Number.isInteger(parsedPage)) {
			setPageInput(String(page));
			return;
		}

		const clampedPage = Math.min(Math.max(parsedPage, 1), totalPages);
		setPageInput(String(clampedPage));

		if (clampedPage !== page) {
			onPageChange(clampedPage);
		}
	};

	return (
		<div className="flex items-center justify-between gap-4">
			<button
				className="rounded-md border border-slate-300 px-3 py-2 font-medium text-sm disabled:cursor-not-allowed disabled:opacity-50"
				disabled={isPreviousDisabled}
				onClick={() => onPageChange(page - 1)}
				type="button"
			>
				Previous
			</button>

			<span className="flex items-center gap-2 text-slate-600 text-sm">
				Page
				<input
					className="w-14 rounded-md border border-slate-300 px-2 py-1 text-center text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={isLoading}
					inputMode="numeric"
					onBlur={commitPageInput}
					onChange={(event) => setPageInput(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							event.currentTarget.blur();
						}
					}}
					value={pageInput}
				/>
				of {totalPages}
			</span>

			<button
				className="rounded-md border border-slate-300 px-3 py-2 font-medium text-sm disabled:cursor-not-allowed disabled:opacity-50"
				disabled={isNextDisabled}
				onClick={() => onPageChange(page + 1)}
				type="button"
			>
				Next
			</button>
		</div>
	);
}
