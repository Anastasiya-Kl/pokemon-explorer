package handler

import (
	"errors"
	"strings"

	"github.com/Anastasiya-Kl/pokemon-explorer/internal/client"
	"github.com/Anastasiya-Kl/pokemon-explorer/internal/service"
	"github.com/gofiber/fiber/v2"
)

type PokemonHandler struct {
	service *service.PokemonService
}

type errorResponse struct {
	Error string `json:"error"`
}

func NewPokemonHandler(service *service.PokemonService) *PokemonHandler {
	return &PokemonHandler{
		service: service,
	}
}

func (h *PokemonHandler) RegisterRoutes(app *fiber.App) {
	app.Get("/pokemon/strongest", h.GetStrongestPokemon)
	app.Get("/pokemon", h.ListPokemon)
	app.Get("/pokemon/:name", h.GetPokemonByName)
}

func (h *PokemonHandler) GetStrongestPokemon(c *fiber.Ctx) error {
	pokemon, err := h.service.GetStrongestPokemon(c.Context())
	if err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(errorResponse{Error: "failed to fetch strongest pokemon"})
	}

	return c.JSON(pokemon)
}

func (h *PokemonHandler) ListPokemon(c *fiber.Ctx) error {
	page := c.QueryInt("page", 0)
	pageSize := c.QueryInt("pageSize", 0)
	search := c.Query("search")

	pokemon, err := h.service.ListPokemon(c.Context(), page, pageSize, search)
	if err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(errorResponse{Error: "failed to fetch pokemon list"})
	}

	return c.JSON(pokemon)
}

func (h *PokemonHandler) GetPokemonByName(c *fiber.Ctx) error {
	name := strings.TrimSpace(c.Params("name"))
	if name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(errorResponse{Error: "pokemon name is required"})
	}

	pokemon, err := h.service.GetPokemonDetail(c.Context(), name)
	if err != nil {
		if errors.Is(err, client.ErrPokemonNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(errorResponse{Error: "pokemon not found"})
		}

		return c.Status(fiber.StatusBadGateway).JSON(errorResponse{Error: "failed to fetch pokemon"})
	}

	return c.JSON(pokemon)
}
