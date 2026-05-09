"use client";

import { ErrorState } from "@/app/_components/ErrorState";

type PokemonDetailErrorPageProps = {
	reset: () => void;
};

export default function PokemonDetailErrorPage({
	reset,
}: PokemonDetailErrorPageProps) {
	return (
		<ErrorState
			description="We couldn't load this Pokémon right now. Please try again."
			reset={reset}
			title="Couldn't load Pokémon"
		/>
	);
}
