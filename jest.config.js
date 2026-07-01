/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',

  testPathIgnorePatterns: ['<rootDir>/tests/e2e/'],

  // Use Babel for ES module transformation
  transform: {
    '^.+\\.js$': ['babel-jest']
  },

  // Handle all JS/ESM files with babel
  transformIgnorePatterns: [],

  globals: {
    window: global.window,
    game: global.game,
    Hooks: global.Hooks,
    CONFIG: global.CONFIG,
    ChatMessage: global.ChatMessage
  }
}
