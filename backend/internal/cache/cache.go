package cache

import (
	"strings"
	"sync"

	"github.com/Anastasiya-Kl/pokemon-explorer/internal/model"
)

type PokemonCache struct {
	mu          sync.RWMutex
	details     map[string]*model.PokemonDetail
	index       []model.PokeAPIResourceName
	indexLoaded bool
}

func NewPokemonCache() *PokemonCache {
	return &PokemonCache{
		details: make(map[string]*model.PokemonDetail),
	}
}

func (c *PokemonCache) GetDetail(name string) (*model.PokemonDetail, bool) {
	key := normalizeKey(name)
	if key == "" {
		return nil, false
	}

	c.mu.RLock()
	defer c.mu.RUnlock()

	pokemon, ok := c.details[key]
	return pokemon, ok
}

func (c *PokemonCache) SetDetail(name string, pokemon *model.PokemonDetail) {
	key := normalizeKey(name)
	if key == "" || pokemon == nil {
		return
	}

	c.mu.Lock()
	defer c.mu.Unlock()

	c.details[key] = pokemon
}

func (c *PokemonCache) GetIndex() ([]model.PokeAPIResourceName, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	if !c.indexLoaded {
		return nil, false
	}

	return copyIndex(c.index), true
}

func (c *PokemonCache) SetIndex(index []model.PokeAPIResourceName) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.index = copyIndex(index)
	c.indexLoaded = true
}

func normalizeKey(name string) string {
	return strings.ToLower(strings.TrimSpace(name))
}

func copyIndex(index []model.PokeAPIResourceName) []model.PokeAPIResourceName {
	copied := make([]model.PokeAPIResourceName, len(index))
	copy(copied, index)

	return copied
}
