import { router } from "expo-router";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";

import type { PokemonCard } from "@/api/pokemon";
import { SkeletonCard } from "@/components/shimmer";
import { Image } from "@/components/uni-image";
import { getTypeTheme } from "@/constants/pokemon-types";
import { usePokemonCards } from "@/hooks/use-pokemon";
import { formatName } from "@/lib/format-name";
import { cn } from "cn";

const keyExtractor = (pokemon: PokemonCard) => pokemon.name;

const PokemonListItem = ({ pokemon }: { pokemon: PokemonCard }) => {
  const theme = getTypeTheme(pokemon.type);

  const openDetails = () => router.push({ pathname: "/details", params: { name: pokemon.name } });

  return (
    <Pressable
      onPress={openDetails}
      className={cn("gap-1 rounded-[30px] p-4 active:opacity-70", theme.background)}
    >
      <Text className={cn("text-center text-[28px] font-bold", theme.foreground)}>
        {formatName(pokemon.name)}
      </Text>

      <View className={cn("self-center rounded-full px-3.5 py-1", theme.chip)}>
        <Text className="text-base font-bold text-white">
          {formatName(pokemon.type)}
        </Text>
      </View>

      {pokemon.image ? (
        <Image
          source={pokemon.image}
          className="mt-1 size-30 self-center"
          contentFit="contain"
          transition={150}
          alt={`${pokemon.name} artwork`}
        />
      ) : null}
    </Pressable>
  );
};

const renderPokemon = ({ item }: { item: PokemonCard }) => <PokemonListItem pokemon={item} />;

const CenteredMessage = ({ children }: { children: React.ReactNode }) => (
  <View className="flex-1 items-center justify-center gap-3 bg-white p-6">
    {children}
  </View>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void; }) => (
  <CenteredMessage>
    <Text className="text-center text-xl font-bold">
      Couldn&apos;t load Pokémon
    </Text>
    <Text className="text-center text-base text-gray-500" selectable>
      {message}
    </Text>
    <Pressable
      onPress={onRetry}
      className="mt-1 rounded-full bg-[#208AEF] px-5 py-2.5 active:opacity-70"
    >
      <Text className="text-base font-semibold text-white">Try again</Text>
    </Pressable>
  </CenteredMessage>
);

const Index = () => {
  const { data: pokemons = [], isPending, isRefetching, error, refetch } = usePokemonCards();

  const handleRefresh = () => { void refetch(); };

  if (error) {
    return <ErrorState message={error.message} onRetry={handleRefresh} />;
  }

  return (
    <FlatList
      className="flex-1 bg-white"
      data={pokemons}
      keyExtractor={keyExtractor}
      renderItem={renderPokemon}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName={cn("gap-4 p-4", pokemons.length === 0 && "grow")}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
      }
      ListEmptyComponent={
        <CenteredMessage>
          {isPending ? (
            <SkeletonCard />
          ) : (
            <Text className="text-base text-gray-500">No Pokémon found</Text>
          )}
        </CenteredMessage>
      }
    />
  );
};

export default Index;
