import { useQuery } from "@tanstack/react-query";

import { fetchPokemonCards, fetchPokemonDetails } from "@/api/pokemon";

const pokemonKeys = {
  all: ["pokemon"] as const,
  list: () => [...pokemonKeys.all, "list"] as const,
  detail: (name: string) => [...pokemonKeys.all, "detail", name] as const,
};

export const usePokemonCards = () =>
  useQuery({
    queryKey: pokemonKeys.list(),
    queryFn: () => fetchPokemonCards(),
  });

export const usePokemonDetails = (name?: string) =>
  useQuery({
    queryKey: pokemonKeys.detail(name ?? ""),
    queryFn: () => fetchPokemonDetails(name as string),
    enabled: Boolean(name),
  });
