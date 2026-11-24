import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getTypeTheme } from "@/constants/pokemon-types";

const POKEMON_LIST_URL = "https://pokeapi.co/api/v2/pokemon/?limit=20";

type PokemonListItem = {
  name: string;
  url: string;
};

type PokemonDetailsResponse = {
  types: { type: { name: string } }[];
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: { front_default: string | null };
    };
  };
};

type PokemonCard = {
  name: string;
  type: string;
  image: string | null;
};

const formatName = (value: string) =>
  value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const Index = () => {
  const [pokemons, setPokemons] = useState<PokemonCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPokemons = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);

    try {
      const listResponse = await fetch(POKEMON_LIST_URL, { signal });
      if (!listResponse.ok) {
        throw new Error(`Request failed (${listResponse.status})`);
      }

      const list = (await listResponse.json()) as {
        results: PokemonListItem[];
      };

      const settled = await Promise.allSettled(
        list.results.map(async (pokemon) => {
          const response = await fetch(pokemon.url, { signal });
          if (!response.ok) {
            throw new Error(`Request failed (${response.status})`);
          }

          const details = (await response.json()) as PokemonDetailsResponse;

          return {
            name: pokemon.name,
            type: details.types[0]?.type.name ?? "unknown",
            image:
              details.sprites.other?.["official-artwork"]?.front_default ??
              details.sprites.front_default ??
              null,
          } satisfies PokemonCard;
        }),
      );

      if (signal?.aborted) return;

      const loaded = settled
        .filter(
          (result): result is PromiseFulfilledResult<PokemonCard> =>
            result.status === "fulfilled",
        )
        .map((result) => result.value);

      if (loaded.length === 0 && settled.length > 0) {
        throw new Error("Couldn't load any Pokémon");
      }

      setPokemons(loaded);
    } catch (caught) {
      if (signal?.aborted) return;
      setPokemons([]);
      setError(
        caught instanceof Error ? caught.message : "Something went wrong",
      );
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchPokemons(controller.signal);
    return () => controller.abort();
  }, [fetchPokemons]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={styles.muted}>Loading Pokémon…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Couldn&apos;t load Pokémon</Text>
        <Text style={styles.muted} selectable>
          {error}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Try loading again"
          onPress={() => fetchPokemons()}
          style={({ pressed }) => [styles.retry, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.retryLabel}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={pokemons}
      keyExtractor={(pokemon) => pokemon.name}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.list,
        pokemons.length === 0 && styles.listEmpty,
      ]}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.title}>No Pokémon found</Text>
          <Text style={styles.muted}>Pull to refresh or try again later.</Text>
        </View>
      }
      renderItem={({ item }) => {
        const theme = getTypeTheme(item.type);

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View details for ${formatName(item.name)}`}
            onPress={() =>
              router.push({ pathname: "/details", params: { name: item.name } })
            }
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: theme.background },
              pressed && styles.cardPressed,
            ]}
          >
            <Text style={[styles.name, { color: theme.foreground }]}>
              {formatName(item.name)}
            </Text>
            <View
              style={[styles.typeChip, { backgroundColor: theme.foreground }]}
            >
              <Text style={styles.typeLabel}>{formatName(item.type)}</Text>
            </View>
            {item.image ? (
              <Image
                source={item.image}
                style={styles.artwork}
                contentFit="contain"
                transition={150}
                alt={`${item.name} artwork`}
              />
            ) : null}
          </Pressable>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
    backgroundColor: "white",
  },
  muted: { color: "gray", fontSize: 16, textAlign: "center" },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  retry: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#208AEF",
  },
  retryLabel: { color: "white", fontSize: 16, fontWeight: "600" },
  list: { gap: 16, padding: 16, backgroundColor: "white" },
  listEmpty: { flexGrow: 1 },
  card: { borderRadius: 30, padding: 16, gap: 4 },
  cardPressed: { opacity: 0.7 },
  name: { textAlign: "center", fontSize: 28, fontWeight: "bold" },
  typeChip: {
    alignSelf: "center",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  typeLabel: { color: "white", fontSize: 16, fontWeight: "bold" },
  artwork: { width: 120, height: 120, alignSelf: "center", marginTop: 4 },
});

export default Index;
