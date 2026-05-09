package client

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/Anastasiya-Kl/pokemon-explorer/internal/model"
)

var ErrPokemonNotFound = errors.New("pokemon not found")

type PokeAPIClient struct {
	baseURL    string
	httpClient *http.Client
}

func NewPokeAPIClient(baseURL string) *PokeAPIClient {
	return &PokeAPIClient{
		baseURL: strings.TrimRight(baseURL, "/"),
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (c *PokeAPIClient) GetPokemonIndex(ctx context.Context) ([]model.PokeAPIResourceName, error) {
	url := fmt.Sprintf("%s/pokemon?limit=100000&offset=0", c.baseURL)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf("create pokemon index request: %w", err)
	}

	res, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("fetch pokemon index: %w", err)
	}
	defer res.Body.Close()

	if res.StatusCode < http.StatusOK || res.StatusCode >= http.StatusMultipleChoices {
		return nil, fmt.Errorf("pokeapi returned status %d for pokemon index", res.StatusCode)
	}

	var listResponse model.PokeAPIListResponse
	if err := json.NewDecoder(res.Body).Decode(&listResponse); err != nil {
		return nil, fmt.Errorf("decode pokemon index: %w", err)
	}

	return listResponse.Results, nil
}

func (c *PokeAPIClient) GetPokemonDetail(ctx context.Context, name string) (*model.PokeAPIPokemonDetail, error) {
	normalizedName := strings.ToLower(strings.TrimSpace(name))
	if normalizedName == "" {
		return nil, fmt.Errorf("pokemon name is required")
	}

	url := fmt.Sprintf("%s/pokemon/%s", c.baseURL, normalizedName)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf("create pokemon detail request: %w", err)
	}

	res, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("fetch pokemon detail: %w", err)
	}
	defer res.Body.Close()

	if res.StatusCode == http.StatusNotFound {
		return nil, ErrPokemonNotFound
	}

	if res.StatusCode < http.StatusOK || res.StatusCode >= http.StatusMultipleChoices {
		return nil, fmt.Errorf("pokeapi returned status %d for pokemon %s", res.StatusCode, normalizedName)
	}

	var pokemon model.PokeAPIPokemonDetail
	if err := json.NewDecoder(res.Body).Decode(&pokemon); err != nil {
		return nil, fmt.Errorf("decode pokemon detail: %w", err)
	}

	return &pokemon, nil
}
