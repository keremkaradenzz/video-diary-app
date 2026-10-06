// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  expoConfig,
  // Must come last: turns off every ESLint rule that Prettier already owns.
  prettierConfig,
  {
    // Tests import the module under test after `jest.mock(...)` on purpose.
    files: ['**/*.test.{ts,tsx}'],
    rules: { 'import/first': 'off' },
  },
  {
    ignores: ['dist/*', 'ios/*', 'android/*', '.expo/*'],
  },
]);
