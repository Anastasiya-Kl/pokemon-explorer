package config

import "os"

const (
	defaultPort       = "8080"
	defaultPokeAPIURL = "https://pokeapi.co/api/v2"
)

type Config struct {
	Port       string
	PokeAPIURL string
}

func Load() Config {
	return Config{
		Port:       getEnv("PORT", defaultPort),
		PokeAPIURL: getEnv("POKEAPI_URL", defaultPokeAPIURL),
	}
}

func getEnv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	return value
}
