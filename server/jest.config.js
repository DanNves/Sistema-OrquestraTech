module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  setupFiles: ['dotenv/config'], // To load .env for tests
};
