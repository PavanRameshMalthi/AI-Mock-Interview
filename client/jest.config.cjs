module.exports = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/src/test/polyfills.js"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss)$": "<rootDir>/src/test/styleMock.js",
  },
  collectCoverageFrom: [
    "src/components/**/*.jsx",
    "src/pages/**/*.jsx",
    "src/routes/**/*.jsx",
    "src/services/**/*.js",
    "!src/services/api.js",
    "!src/main.jsx",
  ],
};
