module.exports = {
  transform: {
      "^.+\\.tsx?$": "ts-jest",
  },
 // testRegex: "(/tests/.*|(\\.|/)(test))\\.(tsx?)$",
  moduleFileExtensions: ["ts",  "js", "json", "node"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts"
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  }
};