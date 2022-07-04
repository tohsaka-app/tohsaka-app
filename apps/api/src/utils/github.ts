export async function getGithubFile(options: { owner: string; branch: string; pathname: string }) {
	const url = `https://raw.githubusercontent.com/${options.owner}/${options.branch}/${options.pathname}`;
	console.log(url);

	const response = await fetch(url);
	return response.ok ? response.text() : null;
}
