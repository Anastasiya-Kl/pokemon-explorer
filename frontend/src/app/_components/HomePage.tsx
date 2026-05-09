"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Pagination } from "@/app/_components/Pagination";
import { PokemonCard } from "@/app/_components/PokemonCard";
import { useDebounce } from "@/hooks/useDebounce";
import { api } from "@/trpc/react";

const pageSize = 20;

export function HomePage() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const urlSearch = searchParams.get("search") ?? "";
	const page = parsePage(searchParams.get("page"));

	const [searchInput, setSearchInput] = useState(urlSearch);
	const debouncedSearch = useDebounce(searchInput, 500);

	useEffect(() => {
		setSearchInput(urlSearch);
	}, [urlSearch]);

	useEffect(() => {
		const nextSearch = debouncedSearch.trim();
		if (nextSearch === urlSearch) {
			return;
		}

		const nextParams = new URLSearchParams();
		nextParams.set("page", "1");
		if (nextSearch !== "") {
			nextParams.set("search", nextSearch);
		}

		router.replace(`${pathname}?${nextParams.toString()}`);
	}, [debouncedSearch, pathname, router, urlSearch]);

	const handlePageChange = (nextPage: number) => {
		const nextParams = new URLSearchParams(searchParams.toString());
		nextParams.set("page", String(nextPage));

		router.push(`${pathname}?${nextParams.toString()}`);
	};

	const pokemonQuery = api.pokemon.list.useQuery({
		page,
		pageSize,
		search: urlSearch,
	});

	return (
		<main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 pt-8 pb-28">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="font-bold text-3xl text-slate-950">
						Pokémon Explorer
					</h1>
				</div>

				<nav className="flex gap-3 text-sm">
					<Link
						className="font-medium text-slate-700 hover:text-slate-950"
						href="/strongest"
					>
						Strongest
					</Link>
				</nav>
			</header>

			<section className="mx-auto w-full max-w-md">
				<input
					aria-label="Search Pokémon by name"
					className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
					id="search"
					onChange={(event) => setSearchInput(event.target.value)}
					placeholder="Search Pokémon by name"
					type="search"
					value={searchInput}
				/>
			</section>

			{pokemonQuery.isLoading ? (
				<p className="text-slate-600">Loading Pokémon...</p>
			) : null}

			{pokemonQuery.isError ? (
				<p className="text-red-600">Failed to load Pokémon.</p>
			) : null}

			{pokemonQuery.data && pokemonQuery.data.items.length === 0 ? (
				<p className="text-slate-600">No Pokémon found.</p>
			) : null}

			{pokemonQuery.data && pokemonQuery.data.items.length > 0 ? (
				<>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{pokemonQuery.data.items.map((pokemon) => (
							<PokemonCard
								backPage={page}
								backSearch={urlSearch}
								key={pokemon.id}
								pokemon={pokemon}
							/>
						))}
					</div>

					<div className="sticky bottom-0 -mx-6 border-slate-200 border-t bg-white px-6 py-4">
						<Pagination
							isLoading={pokemonQuery.isFetching}
							onPageChange={handlePageChange}
							page={pokemonQuery.data.page}
							pageSize={pokemonQuery.data.pageSize}
							total={pokemonQuery.data.total}
						/>
					</div>
				</>
			) : null}
		</main>
	);
}

function parsePage(value: string | null): number {
	const parsed = Number(value);
	if (!Number.isInteger(parsed) || parsed < 1) {
		return 1;
	}

	return parsed;
}
