#!/usr/bin / env node

import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { runCLI } from '../src/cli.js';

const rl = createInterface({
    input: stdin,
    output: stdout,
});

function displayMenu() {
    console.clear();

    console.log(`
========================================
             DEVTRACK CLI
      Developer Productivity Toolkit
========================================

MAIN MENU

  1. Project Management
  2. Task Management
  3. GitHub Repository
  4. Dashboard
  5. Reports
  0. Exit

========================================
`);
}

async function pause() {
    await rl.question('\nPress Enter to continue...');
}

async function projectMenu() {
    let running = true;

    while (running) {
        console.clear();

        console.log(`
========== PROJECT MANAGEMENT ==========

  1. Add Project
  2. List Projects
  3. Show Project
  4. Update Project
  5. Delete Project
  0. Back
`);

        const choice = (await rl.question('Select an option: ')).trim();

        switch (choice) {
            case '1': {
                const name = await rl.question('Project name: ');
                await runCLI(['project', 'add', name]);
                break;
            }

            case '2':
                await runCLI(['project', 'list']);
                break;

            case '3': {
                const name = await rl.question('Project name or ID: ');
                await runCLI(['project', 'show', name]);
                break;
            }

            case '4': {
                const identifier = await rl.question('Project name or ID: ');
                const name = await rl.question('New name (Enter to keep): ');
                const description = await rl.question('New description: ');

                await runCLI([
                    'project',
                    'update',
                    identifier,
                    ...(name ? ['--name', name] : []),
                    '--description',
                    description,
                ]);
                break;
            }

            case '5': {
                const name = await rl.question('Project name or ID: ');
                await runCLI(['project', 'remove', name]);
                break;
            }

            case '0':
                running = false;
                break;

            default:
                console.log('Invalid option.');
        }

        if (running) await pause();
    }
}

async function taskMenu() {
    let running = true;

    while (running) {
        console.clear();

        console.log(`
========== TASK MANAGEMENT ==========

  1. Create Task
  2. List Tasks
  3. Update Task
  4. Delete Task
  0. Back
`);

        const choice = (await rl.question('Select an option: ')).trim();

        switch (choice) {
            case '1': {
                const title = await rl.question('Task title: ');
                const project = await rl.question('Project name or ID: ');
                const priority = await rl.question('Priority (low/medium/high): ');
                const due = await rl.question('Due date (YYYY-MM-DD, optional): ');

                await runCLI([
                    'task',
                    'add',
                    title,
                    '--project',
                    project,
                    '--priority',
                    priority || 'medium',
                    ...(due.trim() ? ['--due', due] : []),
                ]);
                break;
            }

            case '2': {
                const project = await rl.question(
                    'Filter by project (Enter for all): '
                );

                await runCLI([
                    'task',
                    'list',
                    ...(project ? ['--project', project] : []),
                ]);
                break;
            }

            case '3': {
                const identifier = await rl.question('Task title or ID: ');
                const status = await rl.question(
                    'New status (todo/in-progress/completed): '
                );

                await runCLI([
                    'task',
                    'update',
                    identifier,
                    '--status',
                    status,
                ]);
                break;
            }

            case '4': {
                const identifier = await rl.question('Task title or ID: ');
                await runCLI(['task', 'remove', identifier]);
                break;
            }

            case '0':
                running = false;
                break;

            default:
                console.log('Invalid option.');
        }

        if (running) await pause();
    }
}

async function repositoryMenu() {
    const repository = await rl.question('Repository (owner/repo): ');

    if (repository.trim()) {
        await runCLI(['repo', 'inspect', repository.trim()]);
    }

    await pause();
}

async function startMenu() {
    try {
        let running = true;

        while (running) {
            displayMenu();

            const choice = (await rl.question('Select an option: ')).trim();

            switch (choice) {
                case '1':
                    await projectMenu();
                    break;

                case '2':
                    await taskMenu();
                    break;

                case '3':
                    await repositoryMenu();
                    break;

                case '4':
                    await runCLI(['dashboard']);
                    await pause();
                    break;

                case '5':
                    await runCLI(['report']);
                    await pause();
                    break;

                case '0':
                    console.log('\nThank you for using DevTrack CLI!');
                    running = false;
                    break;

                default:
                    console.log('\nInvalid option.');
                    await pause();
            }
        }
    } finally {
        rl.close();
    }
}

// Decide whether to launch a direct command or the interactive menu.
const args = process.argv.slice(2);

if (args.length > 0) {
    runCLI(args)
        .catch(error => {
            console.error('Unexpected error:', error.message);
            process.exitCode = 1;
        })
        .finally(() => rl.close());
} else {
    startMenu().catch(error => {
        console.error('Unexpected error:', error.message);
        process.exitCode = 1;
    });
}
