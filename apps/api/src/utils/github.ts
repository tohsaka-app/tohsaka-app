export async function getGithubFile(options: { owner: string; branch: string; pathname: string }) {
	const url = `https://raw.githubusercontent.com/${options.owner}/${options.branch}/${options.pathname}`;
	console.log(url);

	const response = await fetch(url);
	return response.ok ? response.text() : null;
}

export interface GithubContentsItem {
	name: string;
	path: string;
	sha: string;
	size: number;
	type: "file" | "dir";
}

export async function getGithubContents(options: {
	owner: string;
	branch: string;
	pathname: string;
}): Promise<Array<GithubContentsItem>> {
	const url = `https://api.github.com/repos/${options.owner}/contents/${options.pathname}?ref=${options.branch}`;
	console.log(url);

	const response = await fetch(url);
	return response.ok ? response.json() : null;
}
