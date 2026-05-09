import Link from "next/link";

import { PokemonSprite } from "@/app/_components/PokemonSprite";
import { TypeBadge } from "@/app/_components/TypeBadge";
import type { PokemonListItem } from "@/types/pokemon";
import { formatKebabCaseLabel } from "@/utils/formatKebabCaseLabel";

type PokemonCardProps = {
	pokemon: PokemonListItem;
	backPage?: number;
	backSearch?: string;
};

export function PokemonCard({
	pokemon,
	backPage,
	backSearch,
}: PokemonCardProps) {
	const detailPath = `/pokemon/${encodeURIComponent(pokemon.name)}`;
	const params = new URLSearchParams();
	const trimmedBackSearch = backSearch?.trim();

	if (backPage && backPage > 1) {
		params.set("backPage", String(backPage));
	}

	if (trimmedBackSearch) {
		params.set("backSearch", trimmedBackSearch);
	}

	const queryString = params.toString();
	const detailHref = queryString ? `${detailPath}?${queryString}` : detailPath;

	return (
		<Link
			className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
			href={detailHref}
		>
			<div className="flex items-center gap-4">
				<PokemonSprite
					alt={pokemon.name}
					className="flex h-20 w-20 shrink-0 items-center justify-center"
					imageClassName="h-20 w-20 object-contain"
					src={pokemon.sprite}
				/>

				<div className="min-w-0 space-y-2">
					<h2 className="font-semibold text-lg text-slate-900">
						{formatKebabCaseLabel(pokemon.name)}
					</h2>
					<div className="flex flex-wrap gap-2">
						{pokemon.types.map((type) => (
							<TypeBadge key={type} type={type} />
						))}
					</div>
				</div>
			</div>
		</Link>
	);
}
