
import { parseArgs } from 'node:util';

import {
    addProject,
    listProjects,
    showProject,
    removeProject,
} from './commands/project.js';

import { inspectRepository } from './commands/repo.js';

// Main function that runs the CLI
// Accepts custom arguments or defaults to terminal arguments.
export async function runCLI(args = process.argv.slice(2)) {
    const { values, positionals } = parseArgs({
        args,
        options: {
            help: {
                type: 'boolean',
                short: 'h',
            },
        },
        allowPositionals: true,
        strict: false,
    });

    if (values.help || positionals[0] === 'help') {
        showHelp();
        return;
    }

    const command = positionals[0];
    const action = positionals[1];
    const argument = positionals.slice(2).join(' ');

    if (!command) {
        showHelp();
        return;
    }

    // Project management
    if (command === 'project') {
        switch (action) {
            case 'add':
                await addProject(argument);
                return;

            case 'list':
                await listProjects();
                return;

            case 'show':
                await showProject(argument);
                return;

            case 'remove':
                await removeProject(argument);
                return;

            default:
                console.error('Error: Unknown project action.');
                console.log('Available actions: add, list, show, remove');
                process.exitCode = 1;
                return;
        }
    }

    // GitHub repository management
    if (command === 'repo') {
        if (action === 'inspect') {
            await inspectRepository(argument);
            return;
        }

        console.error('Error: Unknown repository action.');
        console.log('Available actions: inspect');
        process.exitCode = 1;
        return;
    }

    // Features planned for future implementation
    const upcomingCommands = ['task', 'dashboard', 'report'];

    if (upcomingCommands.includes(command)) {
        console.log(`The "${command}" command is not implemented yet.`);
        return;
    }

    console.error(`Error: Unknown command "${command}".`);
    console.log('Run "devtrack --help" to see available commands.');
    process.exitCode = 1;
}

// Display CLI help information
function showHelp() {
    console.log(`
DevTrack CLI
A toolkit for managing developer projects and tasks.

Usage:
  devtrack <command> [arguments]

Commands:
  project    Manage your development projects
  task       Manage your development tasks
  repo       Inspect public GitHub repositories
  dashboard  View your productivity dashboard
  report     Generate a productivity report

Options:
  -h, --help    Display help instructions

Examples:
  devtrack project add "BookNest"
  devtrack project list
  devtrack project show "BookNest"
  devtrack project remove "BookNest"
  devtrack repo inspect facebook/react
`);
}
