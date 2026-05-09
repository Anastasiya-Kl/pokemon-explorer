package main

import (
	"log"

	"github.com/Anastasiya-Kl/pokemon-explorer/internal/cache"
	"github.com/Anastasiya-Kl/pokemon-explorer/internal/client"
	"github.com/Anastasiya-Kl/pokemon-explorer/internal/config"
	"github.com/Anastasiya-Kl/pokemon-explorer/internal/handler"
	"github.com/Anastasiya-Kl/pokemon-explorer/internal/service"
	"github.com/gofiber/fiber/v2"
)

func main() {
	cfg := config.Load()

	app := fiber.New()

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok",
		})
	})

	pokeClient := client.NewPokeAPIClient(cfg.PokeAPIURL)
	pokemonCache := cache.NewPokemonCache()
	pokemonService := service.NewPokemonService(pokeClient, pokemonCache)
	pokemonHandler := handler.NewPokemonHandler(pokemonService)
	pokemonHandler.RegisterRoutes(app)

	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
