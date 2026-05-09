"use client";

import { ErrorState } from "@/app/_components/ErrorState";

type StrongestErrorPageProps = {
	reset: () => void;
};

export default function StrongestErrorPage({ reset }: StrongestErrorPageProps) {
	return (
		<ErrorState
			description="We couldn't load the strongest Pokémon right now. Please try again."
			reset={reset}
			title="Couldn't load strongest Pokémon"
		/>
	);
}
