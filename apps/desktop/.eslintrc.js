// This is a workaround for https://github.com/eslint/eslint/issues/3458
require("@ariesclark/eslint-config/eslint-patch");

module.exports = {
	root: true,
	extends: [
		"@ariesclark/eslint-config",
		"@ariesclark/eslint-config/dist/atoms/node",
		"@ariesclark/eslint-config/dist/atoms/react",
		"@ariesclark/eslint-config/dist/atoms/tailwindcss"
	],
	parserOptions: {
		tsconfigRootDir: __dirname
	}
};
