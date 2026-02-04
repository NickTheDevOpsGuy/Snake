export type FoodTheme = "mixed" | "fruit" | "veggie";

export const FRUIT_EMOJIS = ["🍎", "🍌", "🍇", "🍉", "🍓", "🍑", "🍒", "🥝"];
export const VEGGIE_EMOJIS = ["🥕", "🌽", "🥦", "🥒", "🍅", "🫑", "🥬", "🧅"];
export const MIXED_EMOJIS = [
  ...FRUIT_EMOJIS,
  ...VEGGIE_EMOJIS,
  "🧀",
  "🍕",
];

export function getFoodEmojis(theme: FoodTheme): string[] {
  switch (theme) {
    case "fruit":
      return FRUIT_EMOJIS;
    case "veggie":
      return VEGGIE_EMOJIS;
    default:
      return MIXED_EMOJIS;
  }
}
