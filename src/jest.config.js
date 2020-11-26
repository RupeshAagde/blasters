module.exports = {
  verbose: true,
  coverageReporters: ['json-summary', 'lcov'],
  moduleFileExtensions: ['js', 'json', 'vue'],
setupFiles: ['./jest.init.js'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.js$': './../node_modules/babel-jest'
  },
  coverageDirectory: './../coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['./**/*.{js,vue}', '!**/node_modules/**'],
  transformIgnorePatterns: [
    "/node_modules/",
  ],
  moduleNameMapper: {
    "^@[/](.+)": "<rootDir>/$1",
},
  modulePathIgnorePatterns: ["mocks.js"]

}
