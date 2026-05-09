export type PokemonStat = {
	name: string;
	value: number;
};

export type PokemonDetail = {
	id: number;
	name: string;
	sprite: string;
	types: string[];
	abilities: string[];
	stats: PokemonStat[];
};

export type PokemonListItem = {
	id: number;
	name: string;
	sprite: string;
	types: string[];
};

export type PokemonListResponse = {
	items: PokemonListItem[];
	page: number;
	pageSize: number;
	total: number;
};

export type PokemonStrongestItem = {
	id: number;
	name: string;
	sprite: string;
	types: string[];
	stats: PokemonStat[];
	statTotal: number;
};
