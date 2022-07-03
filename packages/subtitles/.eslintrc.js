// This is a workaround for https://github.com/eslint/eslint/issues/3458
require("@ariesclark/eslint-config/eslint-patch");

module.exports = {
	root: true,
	extends: ["@ariesclark/eslint-config", "@ariesclark/eslint-config/dist/atoms/node"],
	parserOptions: {
		tsconfigRootDir: __dirname
	}
};
