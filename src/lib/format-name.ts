export const formatName = (value: string) => {
  const cleaned = value.replace(/-/g, " ");
  const titled = cleaned.replace(/\b\w/g, (character) => character.toUpperCase());
  return titled;
}
