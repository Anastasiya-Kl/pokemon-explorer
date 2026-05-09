import Link from "next/link";

import { PokemonSprite } from "@/app/_components/PokemonSprite";
import { TypeBadge } from "@/app/_components/TypeBadge";
import type { PokemonStrongestItem } from "@/types/pokemon";
import { formatKebabCaseLabel } from "@/utils/formatKebabCaseLabel";

type StrongestPokemonCardProps = {
	pokemon: PokemonStrongestItem;
	rank: number;
};

export function StrongestPokemonCard({
	pokemon,
	rank,
}: StrongestPokemonCardProps) {
	const detailHref = `/pokemon/${encodeURIComponent(pokemon.name)}?backTo=strongest`;

	return (
		<Link
			className="block rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
			href={detailHref}
		>
			<div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-start">
				<div className="flex shrink-0 items-start gap-3">
					<div className="font-bold text-slate-500 text-sm">#{rank}</div>

					<PokemonSprite
						alt={pokemon.name}
						className="flex h-20 w-20 shrink-0 items-center justify-center"
						imageClassName="h-20 w-20 object-contain"
						src={pokemon.sprite}
					/>
				</div>

				<div className="min-w-0 flex-1 space-y-2">
					<h2 className="font-semibold text-lg text-slate-900">
						{formatKebabCaseLabel(pokemon.name)}
					</h2>
					<div className="flex flex-wrap gap-2">
						{pokemon.types.map((type) => (
							<TypeBadge key={type} type={type} />
						))}
					</div>
				</div>

				<div className="text-left md:text-right">
					<p className="text-slate-500 text-xs">Total</p>
					<p className="font-bold text-slate-950">{pokemon.statTotal}</p>
				</div>
			</div>
		</Link>
	);
}
