package model

type PokemonDetail struct {
	ID        int           `json:"id"`
	Name      string        `json:"name"`
	Sprite    string        `json:"sprite"`
	Types     []string      `json:"types"`
	Abilities []string      `json:"abilities"`
	Stats     []PokemonStat `json:"stats"`
}

type PokemonListItem struct {
	ID     int      `json:"id"`
	Name   string   `json:"name"`
	Sprite string   `json:"sprite"`
	Types  []string `json:"types"`
}

type PokemonListResponse struct {
	Items    []PokemonListItem `json:"items"`
	Page     int               `json:"page"`
	PageSize int               `json:"pageSize"`
	Total    int               `json:"total"`
}

type PokemonStrongestItem struct {
	ID        int           `json:"id"`
	Name      string        `json:"name"`
	Sprite    string        `json:"sprite"`
	Types     []string      `json:"types"`
	Stats     []PokemonStat `json:"stats"`
	StatTotal int           `json:"statTotal"`
}

type PokemonStat struct {
	Name  string `json:"name"`
	Value int    `json:"value"`
}
