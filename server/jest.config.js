module.exports = {
  verbose: true,
  testEnvironment: 'node',
  coverageReporters: ['json-summary', 'lcov'],
  globalSetup: './__tests__/unit/global/test-setup-globals.js',
  globalTeardown: './__tests__/unit/global/test-teardown-globals.js',
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '!**/__tests__/unit/global/**/*.[jt]s?(x)'
  ],
  moduleFileExtensions: ['js', 'json'],
  transform: {},
  coverageDirectory: './../coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['./index.js', '!**/node_modules/**']
}
