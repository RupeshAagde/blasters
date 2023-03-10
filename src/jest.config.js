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
          "token": "49ec1be3-8bfe-48ca-bd15-27df7bb10f2c",
          "endpoint": "https://reportportal.fynd.engineering/api/v1",
          "project": "fynd-platform",
          "launch": "blaster"
        }
    ]
  ]
}
