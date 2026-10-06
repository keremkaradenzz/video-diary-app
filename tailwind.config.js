const colors = require('./src/core/theme/colors.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: { extend: { colors } },
  plugins: [],
};
