export type PokemonTypeTheme = {
  background: string;
  foreground: string;
};

export const TYPE_THEME: Record<string, PokemonTypeTheme> = {
  normal: { background: "#F1F0E8", foreground: "#5F5E4A" },
  fire: { background: "#FDE4D3", foreground: "#9C3D0E" },
  water: { background: "#DCE7FD", foreground: "#1F4FA8" },
  electric: { background: "#FDF3C7", foreground: "#8A6D00" },
  grass: { background: "#DFF2D5", foreground: "#2F6B1F" },
  ice: { background: "#DFF5F4", foreground: "#2A7A77" },
  fighting: { background: "#F8D9D7", foreground: "#8E1F1A" },
  poison: { background: "#F0D9F0", foreground: "#732672" },
  ground: { background: "#F6ECD0", foreground: "#7A621F" },
  flying: { background: "#E9E3FD", foreground: "#4B3596" },
  psychic: { background: "#FDD9E4", foreground: "#A11F4A" },
  bug: { background: "#EEF3CC", foreground: "#5C6A0E" },
  rock: { background: "#F0EACB", foreground: "#6E5E14" },
  ghost: { background: "#E4DBF1", foreground: "#4A3168" },
  dragon: { background: "#E3DCFE", foreground: "#3A1A9E" },
  dark: { background: "#E3DCD7", foreground: "#3F322B" },
  steel: { background: "#EAEAF1", foreground: "#55556A" },
  fairy: { background: "#FBDDE8", foreground: "#9C3460" },
  unknown: { background: "#EDEDED", foreground: "#555555" },
};

export const getTypeTheme = (type: string): PokemonTypeTheme =>
  TYPE_THEME[type] ?? TYPE_THEME.unknown;
