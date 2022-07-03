import { generateAvailable, generateFiles } from "../src/generate";

void (async () => {
	const slugs = process.argv.slice(2);
	if (slugs.length === 0) return generateAvailable();
	await generateFiles(slugs);
})();
