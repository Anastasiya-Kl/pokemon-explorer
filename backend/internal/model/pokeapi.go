package model

type PokeAPIPokemonDetail struct {
	ID        int                  `json:"id"`
	Name      string               `json:"name"`
	Sprites   PokeAPISprites       `json:"sprites"`
	Types     []PokeAPITypeSlot    `json:"types"`
	Abilities []PokeAPIAbilitySlot `json:"abilities"`
	Stats     []PokeAPIStatSlot    `json:"stats"`
}

type PokeAPIListResponse struct {
	Count    int                   `json:"count"`
	Next     *string               `json:"next"`
	Previous *string               `json:"previous"`
	Results  []PokeAPIResourceName `json:"results"`
}

type PokeAPISprites struct {
	FrontDefault string               `json:"front_default"`
	Other        PokeAPISpriteSources `json:"other"`
}

type PokeAPISpriteSources struct {
	OfficialArtwork PokeAPIOfficialArtwork `json:"official-artwork"`
}

type PokeAPIOfficialArtwork struct {
	FrontDefault string `json:"front_default"`
}

type PokeAPITypeSlot struct {
	Type PokeAPIResourceName `json:"type"`
}

type PokeAPIAbilitySlot struct {
	Ability PokeAPIResourceName `json:"ability"`
}

type PokeAPIStatSlot struct {
	BaseStat int                 `json:"base_stat"`
	Stat     PokeAPIResourceName `json:"stat"`
}

type PokeAPIResourceName struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}
