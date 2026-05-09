"use client";

import { ErrorState } from "@/app/_components/ErrorState";

type ErrorPageProps = {
	reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
	return (
		<ErrorState
			description="An unexpected error occurred. Please try again."
			reset={reset}
			title="Something went wrong"
		/>
	);
}
