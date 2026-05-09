package cache

import (
	"strings"
	"sync"
	"time"

	"github.com/Anastasiya-Kl/pokemon-explorer/internal/model"
)

type PokemonCache struct {
	mu          sync.RWMutex
	details     map[string]*model.PokemonDetail
	index       []model.PokeAPIResourceName
	indexLoaded bool

	strongest          []model.PokemonStrongestItem
	strongestExpiresAt time.Time
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

func (c *PokemonCache) GetStrongest(now time.Time) ([]model.PokemonStrongestItem, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	if len(c.strongest) == 0 || !now.Before(c.strongestExpiresAt) {
		return nil, false
	}

	return copyStrongest(c.strongest), true
}

func (c *PokemonCache) SetStrongest(items []model.PokemonStrongestItem, ttl time.Duration, now time.Time) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.strongest = copyStrongest(items)
	c.strongestExpiresAt = now.Add(ttl)
}

func normalizeKey(name string) string {
	return strings.ToLower(strings.TrimSpace(name))
}

func copyIndex(index []model.PokeAPIResourceName) []model.PokeAPIResourceName {
	copied := make([]model.PokeAPIResourceName, len(index))
	copy(copied, index)

	return copied
}

func copyStrongest(items []model.PokemonStrongestItem) []model.PokemonStrongestItem {
	copied := make([]model.PokemonStrongestItem, len(items))
	copy(copied, items)

	return copied
}
