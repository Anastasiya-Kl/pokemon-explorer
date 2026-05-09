import { LoadingState } from "@/app/_components/LoadingState";

export default function LoadingStrongestPage() {
	return (
		<main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-8">
			<LoadingState label="Loading strongest Pokémon..." />
		</main>
	);
}
