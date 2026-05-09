import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { ApiFetchError, apiFetch } from "@/server/api/apiFetch";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import type {
	PokemonDetail,
	PokemonListResponse,
	PokemonStrongestItem,
} from "@/types/pokemon";

export const pokemonRouter = createTRPCRouter({
	list: publicProcedure
		.input(
			z.object({
				page: z.number().int().min(1).default(1),
				pageSize: z.number().int().min(1).max(50).default(20),
				search: z.string().optional(),
			}),
		)
		.query(({ input }) => {
			const params = new URLSearchParams({
				page: String(input.page),
				pageSize: String(input.pageSize),
			});

			const search = input.search?.trim();
			if (search) {
				params.set("search", search);
			}

			return apiFetch<PokemonListResponse>(`/pokemon?${params.toString()}`);
		}),

	byName: publicProcedure
		.input(
			z.object({
				name: z.string().trim().min(1),
			}),
		)
		.query(async ({ input }) => {
			const name = input.name;

			try {
				return await apiFetch<PokemonDetail>(
					`/pokemon/${encodeURIComponent(name)}`,
				);
			} catch (error) {
				if (error instanceof ApiFetchError && error.status === 404) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Pokemon not found",
					});
				}

				throw error;
			}
		}),

	strongest: publicProcedure.query(() => {
		return apiFetch<PokemonStrongestItem[]>("/pokemon/strongest");
	}),
});
