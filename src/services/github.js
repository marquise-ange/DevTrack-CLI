
const GITHUB_API = 'https://api.github.com';

export async function getRepository(owner, repository) {
    if (!owner || !repository) {
        throw new Error('Provide owner and repository name.');
    }

    const response = await fetch(
        `${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`,
        {
            headers: {
                Accept: 'application/vnd.github+json',
                'User-Agent': 'DevTrack-CLI',
            },
            signal: AbortSignal.timeout(10000),
        }
    );

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Repository not found.');
        }

        if (response.status === 403 || response.status === 429) {
            throw new Error('GitHub API rate limit reached. Try again later.');
        }

        throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
}
