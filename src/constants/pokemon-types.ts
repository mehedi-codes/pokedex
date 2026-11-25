export type PokemonTypeTheme = {
  background: string;
  foreground: string;
  chip: string;
};

export const TYPE_THEME: Record<string, PokemonTypeTheme> = {
  normal: {
    background: "bg-[#F1F0E8]",
    foreground: "text-[#5F5E4A]",
    chip: "bg-[#5F5E4A]",
  },
  fire: {
    background: "bg-[#FDE4D3]",
    foreground: "text-[#9C3D0E]",
    chip: "bg-[#9C3D0E]",
  },
  water: {
    background: "bg-[#DCE7FD]",
    foreground: "text-[#1F4FA8]",
    chip: "bg-[#1F4FA8]",
  },
  electric: {
    background: "bg-[#FDF3C7]",
    foreground: "text-[#8A6D00]",
    chip: "bg-[#8A6D00]",
  },
  grass: {
    background: "bg-[#DFF2D5]",
    foreground: "text-[#2F6B1F]",
    chip: "bg-[#2F6B1F]",
  },
  ice: {
    background: "bg-[#DFF5F4]",
    foreground: "text-[#2A7A77]",
    chip: "bg-[#2A7A77]",
  },
  fighting: {
    background: "bg-[#F8D9D7]",
    foreground: "text-[#8E1F1A]",
    chip: "bg-[#8E1F1A]",
  },
  poison: {
    background: "bg-[#F0D9F0]",
    foreground: "text-[#732672]",
    chip: "bg-[#732672]",
  },
  ground: {
    background: "bg-[#F6ECD0]",
    foreground: "text-[#7A621F]",
    chip: "bg-[#7A621F]",
  },
  flying: {
    background: "bg-[#E9E3FD]",
    foreground: "text-[#4B3596]",
    chip: "bg-[#4B3596]",
  },
  psychic: {
    background: "bg-[#FDD9E4]",
    foreground: "text-[#A11F4A]",
    chip: "bg-[#A11F4A]",
  },
  bug: {
    background: "bg-[#EEF3CC]",
    foreground: "text-[#5C6A0E]",
    chip: "bg-[#5C6A0E]",
  },
  rock: {
    background: "bg-[#F0EACB]",
    foreground: "text-[#6E5E14]",
    chip: "bg-[#6E5E14]",
  },
  ghost: {
    background: "bg-[#E4DBF1]",
    foreground: "text-[#4A3168]",
    chip: "bg-[#4A3168]",
  },
  dragon: {
    background: "bg-[#E3DCFE]",
    foreground: "text-[#3A1A9E]",
    chip: "bg-[#3A1A9E]",
  },
  dark: {
    background: "bg-[#E3DCD7]",
    foreground: "text-[#3F322B]",
    chip: "bg-[#3F322B]",
  },
  steel: {
    background: "bg-[#EAEAF1]",
    foreground: "text-[#55556A]",
    chip: "bg-[#55556A]",
  },
  fairy: {
    background: "bg-[#FBDDE8]",
    foreground: "text-[#9C3460]",
    chip: "bg-[#9C3460]",
  },
  unknown: {
    background: "bg-[#EDEDED]",
    foreground: "text-[#555555]",
    chip: "bg-[#555555]",
  },
};

export const getTypeTheme = (type: string): PokemonTypeTheme =>
  TYPE_THEME[type] ?? TYPE_THEME.unknown;
