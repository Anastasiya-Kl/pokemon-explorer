package service

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/Anastasiya-Kl/pokemon-explorer/internal/cache"
	"github.com/Anastasiya-Kl/pokemon-explorer/internal/client"
	"github.com/Anastasiya-Kl/pokemon-explorer/internal/model"
	"golang.org/x/sync/errgroup"
)

const (
	defaultPage               = 1
	defaultPageSize           = 20
	maxPageSize               = 50
	strongestLimit            = 10
	strongestConcurrencyLimit = 15
	strongestCacheTTL         = 10 * time.Minute
)

type PokemonService struct {
	pokeClient   *client.PokeAPIClient
	pokemonCache *cache.PokemonCache
}

func NewPokemonService(pokeClient *client.PokeAPIClient, pokemonCache *cache.PokemonCache) *PokemonService {
	return &PokemonService{
		pokeClient:   pokeClient,
		pokemonCache: pokemonCache,
	}
}

func (s *PokemonService) GetPokemonDetail(ctx context.Context, name string) (*model.PokemonDetail, error) {
	if pokemon, ok := s.pokemonCache.GetDetail(name); ok {
		return pokemon, nil
	}

	apiPokemon, err := s.pokeClient.GetPokemonDetail(ctx, name)
	if err != nil {
		return nil, err
	}

	pokemon := mapPokemonDetail(apiPokemon)
	s.pokemonCache.SetDetail(pokemon.Name, pokemon)

	return pokemon, nil
}

func (s *PokemonService) ListPokemon(ctx context.Context, page int, pageSize int, search string) (*model.PokemonListResponse, error) {
	page, pageSize = normalizePagination(page, pageSize)

	index, err := s.getPokemonIndex(ctx)
	if err != nil {
		return nil, err
	}

	filtered := index
	normalizedSearch := strings.ToLower(strings.TrimSpace(search))
	if normalizedSearch != "" {
		filtered = make([]model.PokeAPIResourceName, 0, len(index))
		for _, item := range index {
			if strings.Contains(strings.ToLower(item.Name), normalizedSearch) {
				filtered = append(filtered, item)
			}
		}
	}

	total := len(filtered)
	start := (page - 1) * pageSize
	if start >= total {
		return &model.PokemonListResponse{
			Items:    []model.PokemonListItem{},
			Page:     page,
			PageSize: pageSize,
			Total:    total,
		}, nil
	}

	end := start + pageSize
	if end > total {
		end = total
	}

	pageItems := filtered[start:end]
	items := make([]model.PokemonListItem, 0, len(pageItems))
	for _, item := range pageItems {
		pokemon, err := s.GetPokemonDetail(ctx, item.Name)
		if err != nil {
			return nil, err
		}

		items = append(items, model.PokemonListItem{
			ID:     pokemon.ID,
			Name:   pokemon.Name,
			Sprite: pokemon.Sprite,
			Types:  pokemon.Types,
		})
	}

	return &model.PokemonListResponse{
		Items:    items,
		Page:     page,
		PageSize: pageSize,
		Total:    total,
	}, nil
}

func (s *PokemonService) GetStrongestPokemon(ctx context.Context) ([]model.PokemonStrongestItem, error) {
	now := time.Now()
	if strongest, ok := s.pokemonCache.GetStrongest(now); ok {
		return strongest, nil
	}

	index, err := s.getPokemonIndex(ctx)
	if err != nil {
		return nil, err
	}

	group, groupCtx := errgroup.WithContext(ctx)
	group.SetLimit(strongestConcurrencyLimit)

	var mu sync.Mutex
	results := make([]model.PokemonStrongestItem, 0, len(index))

	for _, indexItem := range index {
		item := indexItem

		group.Go(func() error {
			pokemon, err := s.GetPokemonDetail(groupCtx, item.Name)
			if err != nil {
				return nil
			}

			statTotal := calculateStatTotal(pokemon.Stats)

			strongestItem := model.PokemonStrongestItem{
				ID:        pokemon.ID,
				Name:      pokemon.Name,
				Sprite:    pokemon.Sprite,
				Types:     pokemon.Types,
				Stats:     pokemon.Stats,
				StatTotal: statTotal,
			}

			mu.Lock()
			results = append(results, strongestItem)
			mu.Unlock()

			return nil
		})
	}

	if err := group.Wait(); err != nil {
		return nil, err
	}

	if len(results) == 0 {
		return nil, fmt.Errorf("no pokemon results collected")
	}

	strongest := rankStrongestPokemon(results, strongestLimit)
	s.pokemonCache.SetStrongest(strongest, strongestCacheTTL, time.Now())

	return strongest, nil
}

func (s *PokemonService) getPokemonIndex(ctx context.Context) ([]model.PokeAPIResourceName, error) {
	index, ok := s.pokemonCache.GetIndex()
	if ok {
		return index, nil
	}

	index, err := s.pokeClient.GetPokemonIndex(ctx)
	if err != nil {
		return nil, err
	}

	s.pokemonCache.SetIndex(index)

	return index, nil
}

func calculateStatTotal(stats []model.PokemonStat) int {
	total := 0
	for _, stat := range stats {
		total += stat.Value
	}

	return total
}

func normalizePagination(page, pageSize int) (int, int) {
	if page < defaultPage {
		page = defaultPage
	}

	if pageSize < 1 {
		pageSize = defaultPageSize
	}

	if pageSize > maxPageSize {
		pageSize = maxPageSize
	}

	return page, pageSize
}

func mapPokemonDetail(apiPokemon *model.PokeAPIPokemonDetail) *model.PokemonDetail {
	types := make([]string, 0, len(apiPokemon.Types))
	for _, apiType := range apiPokemon.Types {
		types = append(types, apiType.Type.Name)
	}

	abilities := make([]string, 0, len(apiPokemon.Abilities))
	for _, apiAbility := range apiPokemon.Abilities {
		abilities = append(abilities, apiAbility.Ability.Name)
	}

	stats := make([]model.PokemonStat, 0, len(apiPokemon.Stats))
	for _, apiStat := range apiPokemon.Stats {
		stats = append(stats, model.PokemonStat{
			Name:  apiStat.Stat.Name,
			Value: apiStat.BaseStat,
		})
	}

	sprite := apiPokemon.Sprites.Other.OfficialArtwork.FrontDefault
	if sprite == "" {
		sprite = apiPokemon.Sprites.FrontDefault
	}

	return &model.PokemonDetail{
		ID:        apiPokemon.ID,
		Name:      apiPokemon.Name,
		Sprite:    sprite,
		Types:     types,
		Abilities: abilities,
		Stats:     stats,
	}
}
