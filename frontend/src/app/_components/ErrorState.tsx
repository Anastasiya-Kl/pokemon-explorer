"use client";

import Link from "next/link";

type ErrorStateProps = {
	title: string;
	description: string;
	reset: () => void;
	homeHref?: string;
	homeLabel?: string;
};

export function ErrorState({
	title,
	description,
	reset,
	homeHref = "/",
	homeLabel = "Home",
}: ErrorStateProps) {
	return (
		<main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-4 px-6 py-8">
			<div className="space-y-2">
				<h1 className="font-bold text-3xl text-slate-950">{title}</h1>
				<p className="text-slate-600">{description}</p>
			</div>

			<div className="flex gap-3">
				<button
					className="cursor-pointer rounded-md border border-slate-300 px-3 py-2 font-medium text-sm transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950"
					onClick={() => reset()}
					type="button"
				>
					Try again
				</button>
				<Link
					className="rounded-md border border-slate-300 px-3 py-2 font-medium text-sm transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950"
					href={homeHref}
				>
					{homeLabel}
				</Link>
			</div>
		</main>
	);
}
