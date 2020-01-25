// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  verbose: true,
  preset: "ts-jest",
  globals: {
    __DEV__: true,
    __TEST__: true,
    __VERSION__: require("./package.json").version,
    __BROWSER__: false,
    __BUNDLER__: true,
    __RUNTIME_COMPILE__: true,
    __FEATURE_OPTIONS__: true,
    __FEATURE_SUSPENSE__: true
  },
  coverageDirectory: "coverage",
  coverageReporters: ["html", "text"],
  collectCoverageFrom: ["src/**/*.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  //  moduleNameMapper: {
  //    "^@swtc/(.*?)$": "<rootDir>/../$1/src"
  //  },
  rootDir: __dirname,
  testMatch: [
    "<rootDir>/test/test*.[jt]s?(x)",
    "<rootDir>/test/*spec.[jt]s?(x)"
  ]
}
