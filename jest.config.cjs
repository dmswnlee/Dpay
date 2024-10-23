module.exports = {
	preset: "ts-jest",
	testEnvironment: "jest-environment-jsdom",
	setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	moduleNameMapper: {
		"\\.(css|less|sass|scss)$": "identity-obj-proxy",
		"\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
	},
	testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
};
