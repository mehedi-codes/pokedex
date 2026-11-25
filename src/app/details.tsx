import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { CenteredMessage } from "@/components/centered-message";
import { ErrorState } from "@/components/error-state";
import { Image } from "@/components/uni-image";
import { getTypeTheme } from "@/constants/pokemon-types";
import { usePokemonDetails } from "@/hooks/use-pokemon";
import { formatName } from "@/lib/format-name";
import { cn } from "cn";

type PokemonDetails = NonNullable<ReturnType<typeof usePokemonDetails>["data"]>;

const MAX_BASE_STAT = 255;

const formatId = (id: number) => `#${String(id).padStart(3, "0")}`;

const getArtwork = (details: PokemonDetails) =>
  details.sprites.other?.["official-artwork"]?.front_default ??
  details.sprites.front_default ??
  null;

const useNameParam = () => {
  const { name } = useLocalSearchParams<{ name?: string | string[] }>();
  return Array.isArray(name) ? name[0] : name;
};

const Header = ({ details }: { details: PokemonDetails }) => {
  const theme = getTypeTheme(details.types[0]?.type.name ?? "unknown");

  return (
    <View
      className={cn("items-center gap-1 rounded-3xl px-4 py-4", theme.background)}
    >
      <Image
        source={getArtwork(details)}
        className="size-50"
        contentFit="contain"
        transition={200}
        alt={details.name}
      />
      <Text className={cn("text-[28px] font-bold", theme.foreground)} selectable>
        {formatName(details.name)}
      </Text>
      <Text className={cn("text-base font-semibold", theme.foreground)}>
        {formatId(details.id)}
      </Text>

      <View className="mt-2 flex-row flex-wrap justify-center gap-2">
        {details.types.map(({ type }) => (
          <View
            key={type.name}
            className={cn("rounded-full px-3.5 py-1.5", theme.chip)}
          >
            <Text className="text-[15px] font-semibold text-white">
              {formatName(type.name)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const InfoTile = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-1 items-center gap-1 rounded-2xl bg-gray-100 py-3">
    <Text className="text-[13px] font-semibold uppercase text-gray-500">
      {label}
    </Text>
    <Text className="text-lg font-bold" selectable>
      {value}
    </Text>
  </View>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="gap-2">
    <Text className="text-xl font-bold">{title}</Text>
    {children}
  </View>
);

const StatRow = ({ label, value }: { label: string; value: number }) => (
  <View className="gap-1">
    <View className="flex-row justify-between">
      <Text className="text-base text-gray-500">{label}</Text>
      <Text className="text-base font-semibold tabular-nums">{value}</Text>
    </View>
    <View className="h-1.5 overflow-hidden rounded-full bg-gray-200">
      <View
        className="h-1.5 rounded-full bg-[#208AEF]"
        style={{ width: `${Math.min(value / MAX_BASE_STAT, 1) * 100}%` }}
      />
    </View>
  </View>
);

const DetailsContent = ({ details }: { details: PokemonDetails }) => (
  <ScrollView
    className="bg-white"
    contentContainerClassName="gap-5 p-4"
    contentInsetAdjustmentBehavior="automatic"
  >
    <Header details={details} />

    <View className="flex-row gap-3">
      <InfoTile label="Height" value={`${(details.height / 10).toFixed(1)} m`} />
      <InfoTile label="Weight" value={`${(details.weight / 10).toFixed(1)} kg`} />
    </View>

    <Section title="Abilities">
      {details.abilities.map(({ ability, is_hidden }) => (
        <Text key={ability.name} className="text-base">
          {formatName(ability.name)}
          {is_hidden ? " (hidden)" : ""}
        </Text>
      ))}
    </Section>

    <Section title="Base stats">
      {details.stats.map(({ stat, base_stat }) => (
        <StatRow
          key={stat.name}
          label={formatName(stat.name)}
          value={base_stat}
        />
      ))}
    </Section>
  </ScrollView>
);

const Details = () => {
  const name = useNameParam();
  const { data: details, isPending, error, refetch } = usePokemonDetails(name);

  const renderBody = () => {
    if (!name) {
      return (
        <CenteredMessage>
          <Text className="text-center text-xl font-bold">
            No Pokémon selected
          </Text>
          <Text className="text-base text-gray-500">
            Go back and pick one from the list.
          </Text>
        </CenteredMessage>
      );
    }

    if (isPending) {
      return (
        <CenteredMessage>
          <ActivityIndicator />
          <Text className="text-base text-gray-500">Loading…</Text>
        </CenteredMessage>
      );
    }

    if (error || !details) {
      return (
        <ErrorState
          title="Couldn't load this Pokémon"
          message={error?.message ?? "Pokémon not found."}
          onRetry={() => void refetch()}
        />
      );
    }

    return <DetailsContent details={details} />;
  };

  return (
    <>
      <Stack.Screen options={{ title: name ? formatName(name) : "Details" }} />
      {renderBody()}
    </>
  );
};

export default Details;
