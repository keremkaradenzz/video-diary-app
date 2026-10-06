module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
};
