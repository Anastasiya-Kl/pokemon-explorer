import Link from "next/link";

import { StrongestPokemonCard } from "@/app/_components/StrongestPokemonCard";
import { api } from "@/trpc/server";

export default async function StrongestPage() {
	const pokemon = await api.pokemon.strongest();

	return (
		<main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-8">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="font-bold text-3xl text-slate-950">
						Strongest Pokémon
					</h1>
					<p className="mt-2 text-slate-600">
						Top 10 Pokémon ranked by total base stats.
					</p>
				</div>

				<nav className="flex gap-3 text-sm">
					<Link
						className="font-medium text-slate-700 hover:text-slate-950"
						href="/"
					>
						Home
					</Link>
				</nav>
			</header>

			{pokemon.length === 0 ? (
				<p className="text-slate-600">No Pokémon found.</p>
			) : (
				<div className="grid gap-4 lg:grid-cols-2">
					{pokemon.map((item, index) => (
						<StrongestPokemonCard
							key={item.id}
							pokemon={item}
							rank={index + 1}
						/>
					))}
				</div>
			)}
		</main>
	);
}
