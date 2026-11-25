import { View, StyleSheet } from "react-native";

type SkeletonCardProps = {
  theme?: {
    background: string;
    foreground: string;
    chip: string;
  };
};

export const SkeletonCard = ({ theme }: SkeletonCardProps = {}) => {
  // Default to "normal" type theme for skeleton
  const bgColor = theme?.background?.replace("bg-", "") ?? "#F1F0E8";
  const chipColor = theme?.chip?.replace("bg-", "") ?? "#5F5E4A";

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: bgColor },
      ]}
    >
      {/* Name placeholder */}
      <View style={styles.namePlaceholder}>
        <View style={[
          styles.textLine,
          { backgroundColor: chipColor },
        ]} />
      </View>

      {/* Type chip placeholder */}
      <View style={styles.chipContainer}>
        <View style={[
          styles.chipPlaceholder,
          { backgroundColor: chipColor },
        ]} />
      </View>

      {/* Image placeholder */}
      <View style={styles.imageContainer}>
        <View style={[
          styles.imagePlaceholder,
          { backgroundColor: "#e0e0e0" },
        ]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 30,
    padding: 16,
    gap: 4,
  },
  namePlaceholder: {
    alignItems: "center",
    marginBottom: 2,
  },
  textLine: {
    width: "50%",
    height: 28,
    borderRadius: 8,
    opacity: 0.6,
  },
  chipContainer: {
    alignItems: "center",
    marginBottom: 4,
  },
  chipPlaceholder: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 9999,
    opacity: 0.6,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 4,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 12,
    opacity: 0.6,
  },
});