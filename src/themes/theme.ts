import colors from './colors.json';

// Single source of truth for the palette. `tailwind.config.js` reads the same JSON, so class names
// (`bg-brand`) and props that cannot take a class (Slider tint, navigator background) never drift.
export const theme = { colors } as const;
