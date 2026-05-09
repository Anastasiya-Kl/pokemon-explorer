package service

import (
	"sort"

	"github.com/Anastasiya-Kl/pokemon-explorer/internal/model"
)

func rankStrongestPokemon(items []model.PokemonStrongestItem, limit int) []model.PokemonStrongestItem {
	if limit <= 0 {
		return []model.PokemonStrongestItem{}
	}

	ranked := append([]model.PokemonStrongestItem(nil), items...)

	sort.Slice(ranked, func(i, j int) bool {
		if ranked[i].StatTotal == ranked[j].StatTotal {
			return ranked[i].ID < ranked[j].ID
		}
		return ranked[i].StatTotal > ranked[j].StatTotal
	})

	if len(ranked) > limit {
		return ranked[:limit]
	}

	return ranked
}
