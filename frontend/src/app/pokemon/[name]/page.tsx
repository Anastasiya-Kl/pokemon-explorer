import { TRPCError } from "@trpc/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PokemonSprite } from "@/app/_components/PokemonSprite";
import { TypeBadge } from "@/app/_components/TypeBadge";
import { api } from "@/trpc/server";
import type { PokemonDetail } from "@/types/pokemon";
import { formatKebabCaseLabel } from "@/utils/formatKebabCaseLabel";

type PokemonDetailPageProps = {
	params: Promise<{
		name: string;
	}>;
	searchParams: Promise<{
		backTo?: string | string[];
		backPage?: string | string[];
		backSearch?: string | string[];
	}>;
};

const maxBaseStatValue = 255;

export default async function PokemonDetailPage({
	params,
	searchParams,
}: PokemonDetailPageProps) {
	const { name } = await params;
	if (name === "strongest") {
		redirect("/strongest");
	}

	const { backTo, backPage, backSearch } = await searchParams;
	let pokemon: PokemonDetail;
	try {
		pokemon = await api.pokemon.byName({ name });
	} catch (error) {
		if (error instanceof TRPCError && error.code === "NOT_FOUND") {
			notFound();
		}

		throw error;
	}

	const backHref = buildBackHref(backTo, backPage, backSearch);

	return (
		<main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-8">
			<Link
				className="font-medium text-slate-700 text-sm hover:text-slate-950"
				href={backHref}
			>
				Back
			</Link>

			<section className="grid gap-8 md:grid-cols-[220px_1fr]">
				<div className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
					<PokemonSprite
						alt={pokemon.name}
						className="flex h-44 w-44 items-center justify-center"
						imageClassName="h-44 w-44 object-contain"
						src={pokemon.sprite}
					/>
				</div>

				<div className="space-y-5">
					<h1 className="font-bold text-3xl text-slate-950">
						{formatKebabCaseLabel(pokemon.name)}
					</h1>

					<div className="flex flex-wrap gap-2">
						{pokemon.types.map((type) => (
							<TypeBadge key={type} type={type} />
						))}
					</div>

					<section className="space-y-2">
						<h2 className="font-semibold text-slate-950">Abilities</h2>
						{pokemon.abilities.length > 0 ? (
							<ul className="list-inside list-disc text-slate-700">
								{pokemon.abilities.map((ability) => (
									<li key={ability}>{formatKebabCaseLabel(ability)}</li>
								))}
							</ul>
						) : (
							<p className="text-slate-600">No abilities available.</p>
						)}
					</section>

					<section className="space-y-2">
						<h2 className="font-semibold text-slate-950">Stats</h2>
						{pokemon.stats.length > 0 ? (
							<ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
								{pokemon.stats.map((stat) => {
									const percentage = getStatPercentage(stat.value);

									return (
										<li
											className="grid gap-2 px-4 py-2 md:grid-cols-[140px_1fr_48px] md:items-center"
											key={stat.name}
										>
											<span className="text-slate-700">
												{formatKebabCaseLabel(stat.name)}
											</span>
											<div className="h-2 overflow-hidden rounded-full bg-slate-100">
												<div
													className="h-full rounded-full bg-slate-700"
													style={{ width: `${percentage}%` }}
												/>
											</div>
											<span className="font-medium text-slate-950 md:text-right">
												{stat.value}
											</span>
										</li>
									);
								})}
							</ul>
						) : (
							<p className="text-slate-600">No stats available.</p>
						)}
					</section>
				</div>
			</section>
		</main>
	);
}

function getStatPercentage(value: number): number {
	const percentage = (value / maxBaseStatValue) * 100;

	return Math.min(Math.max(percentage, 0), 100);
}

function buildBackHref(
	backTo: string | string[] | undefined,
	backPage: string | string[] | undefined,
	backSearch: string | string[] | undefined,
): string {
	if (backTo === "strongest") {
		return "/strongest";
	}

	const params = new URLSearchParams();
	const page = parseBackPage(backPage);
	const search = parseBackSearch(backSearch);

	if (page > 1) {
		params.set("page", String(page));
	}

	if (search !== "") {
		params.set("search", search);
	}

	const queryString = params.toString();
	return queryString ? `/?${queryString}` : "/";
}

function parseBackPage(value: string | string[] | undefined): number {
	if (typeof value !== "string") {
		return 1;
	}

	const parsed = Number(value);
	if (!Number.isInteger(parsed) || parsed < 1) {
		return 1;
	}

	return parsed;
}

function parseBackSearch(value: string | string[] | undefined): string {
	if (typeof value !== "string") {
		return "";
	}

	return value.trim();
}
