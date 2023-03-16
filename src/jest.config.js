const conf = require('../config')
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
  // coveragePathIgnorePatterns: ["services/pdf", "pages/oms"], // @ToDo remove this
  coveragePathIgnorePatterns: ["services/pdf"], // @ToDo remove this
  // modulePathIgnorePatterns: [
  //   'test/specs/pages/oms'  // temporarliy Ignored, once dev stable 
  // ],

  moduleNameMapper: {
    "^@[/](.+)": "<rootDir>/$1",
  },
  modulePathIgnorePatterns: ["mocks.js", 'less',
    'mixins',
    'router',
    'pipes'],
  bail: true,
  reporters: [
    "default",
    [
        "@reportportal/agent-js-jest",
        {
          "token": conf.get('REPORT_PORTAL_ACCESS_TOKEN'),
          "endpoint": conf.get('REPORT_PORTAL_ENDPOINT'),
          "project": conf.get('REPORT_PORTAL_PROJECT'),
          "launch": 'blaster'
        }
    ]
  ]
}
