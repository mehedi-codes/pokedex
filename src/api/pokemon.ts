import { create, isAxiosError } from "axios";

const api = create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 15_000,
});

// PokeAPI returns 404 for unknown names; show a friendlier message than axios default.
api.interceptors.response.use(undefined, (error) => {
  if (isAxiosError(error) && error.response?.status === 404) {
    return Promise.reject(new Error("Pokémon not found"));
  }

  return Promise.reject(error);
});

type PokemonListItem = {
  name: string;
  url: string;
};

type PokemonListResponse = {
  results: PokemonListItem[];
};

type PokemonType = { type: { name: string } };

export type PokemonCard = {
  name: string;
  type: string;
  image: string | null;
};

type PokemonListDetails = {
  types: PokemonType[];
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: { front_default: string | null };
    };
  };
};

export type PokemonStat = {
  base_stat: number;
  stat: { name: string };
};

export type PokemonAbility = {
  ability: { name: string };
  is_hidden: boolean;
};

export type PokemonDetails = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: PokemonListDetails["sprites"];
};

const getArtwork = (sprites: PokemonListDetails["sprites"]) =>
  sprites.other?.["official-artwork"]?.front_default ??
  sprites.front_default ??
  null;

export const fetchPokemonCards = async (): Promise<PokemonCard[]> => {
  const { data: list } = await api.get<PokemonListResponse>("/pokemon?limit=20");

  const details = await Promise.all(
    list.results.map(({ url }) => api.get<PokemonListDetails>(url)),
  );

  return list.results.map(({ name }, index) => {
    const pokemon = details[index].data;

    return {
      name,
      type: pokemon.types[0]?.type.name ?? "unknown",
      image: getArtwork(pokemon.sprites),
    };
  });
};

export const fetchPokemonDetails = async (
  name: string,
): Promise<PokemonDetails> => {
  const { data } = await api.get<PokemonDetails>(
    `/pokemon/${encodeURIComponent(name)}`,
  );

  return data;
};
