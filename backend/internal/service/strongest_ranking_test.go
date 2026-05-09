package service

import (
	"reflect"
	"testing"

	"github.com/Anastasiya-Kl/pokemon-explorer/internal/model"
)

func TestRankStrongestPokemon(t *testing.T) {
	tests := []struct {
		name  string
		items []model.PokemonStrongestItem
		limit int
		want  []model.PokemonStrongestItem
	}{
		{
			name: "sorts by StatTotal descending",
			items: []model.PokemonStrongestItem{
				{ID: 1, Name: "one", StatTotal: 100},
				{ID: 2, Name: "two", StatTotal: 300},
				{ID: 3, Name: "three", StatTotal: 200},
			},
			limit: 3,
			want: []model.PokemonStrongestItem{
				{ID: 2, Name: "two", StatTotal: 300},
				{ID: 3, Name: "three", StatTotal: 200},
				{ID: 1, Name: "one", StatTotal: 100},
			},
		},
		{
			name: "tie-breaks equal StatTotal by ID ascending",
			items: []model.PokemonStrongestItem{
				{ID: 25, Name: "pikachu", StatTotal: 300},
				{ID: 6, Name: "charizard", StatTotal: 300},
				{ID: 150, Name: "mewtwo", StatTotal: 200},
			},
			limit: 3,
			want: []model.PokemonStrongestItem{
				{ID: 6, Name: "charizard", StatTotal: 300},
				{ID: 25, Name: "pikachu", StatTotal: 300},
				{ID: 150, Name: "mewtwo", StatTotal: 200},
			},
		},
		{
			name: "limits result length",
			items: []model.PokemonStrongestItem{
				{ID: 1, Name: "one", StatTotal: 100},
				{ID: 2, Name: "two", StatTotal: 300},
				{ID: 3, Name: "three", StatTotal: 200},
			},
			limit: 2,
			want: []model.PokemonStrongestItem{
				{ID: 2, Name: "two", StatTotal: 300},
				{ID: 3, Name: "three", StatTotal: 200},
			},
		},
		{
			name: "handles fewer items than limit",
			items: []model.PokemonStrongestItem{
				{ID: 4, Name: "four", StatTotal: 400},
				{ID: 5, Name: "five", StatTotal: 500},
			},
			limit: 10,
			want: []model.PokemonStrongestItem{
				{ID: 5, Name: "five", StatTotal: 500},
				{ID: 4, Name: "four", StatTotal: 400},
			},
		},
		{

			name: "returns empty result for zero limit",
			items: []model.PokemonStrongestItem{
				{ID: 1, Name: "one", StatTotal: 100},
			},
			limit: 0,
			want:  []model.PokemonStrongestItem{},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := rankStrongestPokemon(tt.items, tt.limit)
			if !reflect.DeepEqual(got, tt.want) {
				t.Fatalf("rankStrongestPokemon() = %#v, want %#v", got, tt.want)
			}
		})
	}
}
