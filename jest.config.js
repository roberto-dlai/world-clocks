module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests/unit'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/**/*.test.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true
};
