
import { getRepository } from '../services/github.js';

export async function inspectRepository(identifier) {
    if (!identifier || !identifier.includes('/')) {
        console.log('Use this format: owner/repository');
        return;
    }

    const [owner, repository] = identifier.split('/');

    if (!owner || !repository || identifier.split('/').length !== 2) {
        console.log('Invalid repository format.');
        return;
    }

    try {
        const repo = await getRepository(owner, repository);

        console.log('\n========== GITHUB REPOSITORY ==========\n');
        console.log(`Name: ${repo.full_name}`);
        console.log(`Description: ${repo.description || 'No description'}`);
        console.log(`Owner: ${repo.owner.login}`);
        console.log(`Language: ${repo.language || 'Not specified'}`);
        console.log(`Stars: ${repo.stargazers_count}`);
        console.log(`Forks: ${repo.forks_count}`);
        console.log(`Open Issues: ${repo.open_issues_count}`);
        console.log(`Visibility: ${repo.visibility}`);
        console.log(`URL: ${repo.html_url}`);
        console.log(`Updated: ${new Date(repo.updated_at).toLocaleString()}`);
    } catch (error) {
        console.log(`GitHub error: ${error.message}`);
    }
}
