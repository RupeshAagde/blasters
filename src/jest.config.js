const conf = require('../config')
const { REPORT_PORTAL_ACCESS_TOKEN,REPORT_PORTAL_ENDPOINT,REPORT_PORTAL_PROJECT, local } = conf.get();
let jestConfig = {
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
  bail: true
}

if(!conf.get('local')){
  jestConfig['reporters'] = [
    "default",
    [
        "@reportportal/agent-js-jest",
        {
          "token": REPORT_PORTAL_ACCESS_TOKEN,
          "endpoint": REPORT_PORTAL_ENDPOINT,
          "project": REPORT_PORTAL_PROJECT,
          "launch": 'blaster',
          "logLaunchLink": true
        }
    ]
  ]
}

module.exports = jestConfig;
