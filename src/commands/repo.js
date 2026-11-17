
import ora from 'ora';
import { getRepository } from '../services/github.js';
import { success, errorMessage } from '../utils/formatter.js';

export async function inspectRepository(identifier) {
    if (!identifier || !identifier.includes('/')) {
        errorMessage('Use this format: owner/repository');
        process.exitCode = 1;
        return;
    }

    const [owner, repository] = identifier.split('/');

    if (!owner || !repository || identifier.split('/').length !== 2) {
        errorMessage('Invalid repository format.');
        process.exitCode = 1;
        return;
    }

    const spinner = ora('Fetching GitHub repository information...').start();

    try {
        const repo = await getRepository(owner, repository);

        spinner.succeed('Repository information loaded successfully!');

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
        spinner.fail('Could not fetch repository information.');
        errorMessage(error.message);
        process.exitCode = 1;
    }
}
