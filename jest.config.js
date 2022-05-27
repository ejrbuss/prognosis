const config = {
	preset: "ts-jest/presets/default-esm",
	globals: {
		"ts-jest": {
			useESM: true,
		},
	},
	moduleNameMapper: {
		"(.+)\\.js": "$1",
	},
};

export default config;
