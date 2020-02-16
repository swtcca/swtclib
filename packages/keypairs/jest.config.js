// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  verbose: true,
  preset: "ts-jest",
  coverageDirectory: "coverage",
  coverageReporters: ["html", "text"],
  collectCoverageFrom: ["src/**/*.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  moduleNameMapper: {
    "^swtc-(.*?)$": "<rootDir>/../swtc-$1/"
  },
  rootDir: __dirname,
  testMatch: [
    "<rootDir>/test/test*.[jt]s?(x)",
    "<rootDir>/test/*spec.[jt]s?(x)"
  ]
}
