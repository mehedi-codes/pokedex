import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getTypeTheme } from "@/constants/pokemon-types";

type PokemonType = { type: { name: string } };

type PokemonStat = {
  base_stat: number;
  stat: { name: string };
};

type PokemonAbility = {
  ability: { name: string };
  is_hidden: boolean;
};

type PokemonSprites = {
  front_default: string | null;
  back_default: string | null;
  other?: {
    "official-artwork"?: { front_default: string | null };
  };
};

type PokemonDetails = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
};

const formatName = (value: string) =>
  value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const Details = () => {
  const params = useLocalSearchParams();
  const rawName = params.name;
  const name = Array.isArray(rawName) ? rawName[0] : rawName;

  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!name) {
        setDetails(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`,
          { signal },
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Pokémon not found"
              : `Request failed (${response.status})`,
          );
        }

        const data = (await response.json()) as PokemonDetails;
        if (!signal?.aborted) setDetails(data);
      } catch (caught) {
        if (signal?.aborted) return;
        setDetails(null);
        setError(
          caught instanceof Error ? caught.message : "Something went wrong",
        );
      } finally {
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [name],
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const artwork =
    details?.sprites.other?.["official-artwork"]?.front_default ??
    details?.sprites.front_default ??
    null;

  const theme = getTypeTheme(details?.types[0]?.type.name ?? "unknown");

  return (
    <>
      <Stack.Screen options={{ title: name ? formatName(name) : "Details" }} />

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator />
          <Text style={styles.muted}>Loading…</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.title}>Couldn&apos;t load this Pokémon</Text>
          <Text style={styles.muted} selectable>
            {error}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Try loading again"
            onPress={() => load()}
            style={({ pressed }) => [styles.retry, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.retryLabel}>Try again</Text>
          </Pressable>
        </View>
      ) : !details ? (
        <View style={styles.centered}>
          <Text style={styles.title}>No Pokémon selected</Text>
          <Text style={styles.muted}>Go back and pick one from the list.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="automatic"
        >
          <View style={[styles.hero, { backgroundColor: theme.background }]}>
            <Image
              source={artwork}
              style={styles.artwork}
              contentFit="contain"
              transition={200}
              alt={details.name}
            />
            <Text style={[styles.name, { color: theme.foreground }]} selectable>
              {formatName(details.name)}
            </Text>
            <Text style={[styles.id, { color: theme.foreground }]}>
              #{String(details.id).padStart(3, "0")}
            </Text>

            <View style={styles.types}>
              {details.types.map(({ type }) => (
                <View
                  key={type.name}
                  style={[styles.typeChip, { backgroundColor: theme.foreground }]}
                >
                  <Text style={[styles.typeLabel, { color: "white" }]}>
                    {formatName(type.name)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.factRow}>
            <View style={styles.fact}>
              <Text style={styles.factLabel}>Height</Text>
              <Text style={styles.factValue} selectable>
                {(details.height / 10).toFixed(1)} m
              </Text>
            </View>
            <View style={styles.fact}>
              <Text style={styles.factLabel}>Weight</Text>
              <Text style={styles.factValue} selectable>
                {(details.weight / 10).toFixed(1)} kg
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Abilities</Text>
            {details.abilities.map(({ ability, is_hidden }) => (
              <Text key={ability.name} style={styles.body}>
                {formatName(ability.name)}
                {is_hidden ? " (hidden)" : ""}
              </Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Base stats</Text>
            {details.stats.map(({ stat, base_stat }) => (
              <View key={stat.name} style={styles.statRowContainer}>
                <View style={styles.statRow}>
                  <Text style={styles.muted}>{formatName(stat.name)}</Text>
                  <Text style={styles.statValue}>{base_stat}</Text>
                </View>
                <View style={styles.statTrack}>
                  <View
                    style={[
                      styles.statFill,
                      { width: `${Math.min(base_stat / 255, 1) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </>
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
  muted: { color: "gray", fontSize: 16 },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  retry: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#208AEF",
  },
  retryLabel: { color: "white", fontSize: 16, fontWeight: "600" },
  content: { gap: 20, padding: 16, backgroundColor: "white" },
  hero: {
    alignItems: "center",
    gap: 4,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  artwork: { width: 200, height: 200 },
  name: { fontSize: 28, fontWeight: "700" },
  id: { fontSize: 16, fontWeight: "600", color: "gray" },
  types: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  typeChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  typeLabel: { fontSize: 15, fontWeight: "600", color: "#065F46" },
  factRow: { flexDirection: "row", gap: 12 },
  fact: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    borderRadius: 16,
    paddingVertical: 12,
    backgroundColor: "#F3F4F6",
  },
  factLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "gray",
    textTransform: "uppercase",
  },
  factValue: { fontSize: 18, fontWeight: "700" },
  section: { gap: 8 },
  sectionTitle: { fontSize: 20, fontWeight: "700" },
  body: { fontSize: 16 },
  statRowContainer: { gap: 4 },
  statRow: { flexDirection: "row", justifyContent: "space-between" },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  statTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  statFill: { height: 6, borderRadius: 3, backgroundColor: "#208AEF" },
});

export default Details;
