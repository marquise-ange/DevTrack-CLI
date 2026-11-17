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

    console.log('========================================');
    console.log('             DEVTRACK CLI');
    console.log('      Developer Productivity Toolkit');
    console.log('========================================');

    console.log('\nMAIN MENU\n');

    console.log('  1. Project Management');
    console.log('  2. Task Management');
    console.log('  3. GitHub Repository');
    console.log('  4. Dashboard');
    console.log('  5. Reports');
    console.log('  0. Exit');

    console.log('\n========================================');
}

async function projectMenu() {
    let running = true;

    while (running) {
        console.clear();

        console.log('\n========== PROJECT MANAGEMENT ==========\n');
        console.log('  1. Add Project');
        console.log('  2. List Projects');
        console.log('  3. Show Project Details');
        console.log('  4. Remove Project');
        console.log('  0. Back to Main Menu');

        const choice = (await rl.question('\nSelect an option: ')).trim();

        switch (choice) {
            case '1': {
                const name = await rl.question('Enter project name: ');
                await runCLI(['project', 'add', name.trim()]);
                break;
            }

            case '2':
                await runCLI(['project', 'list']);
                break;

            case '3': {
                const name = await rl.question('Enter project name: ');
                await runCLI(['project', 'show', name.trim()]);
                break;
            }

            case '4': {
                const name = await rl.question('Enter project name: ');
                await runCLI(['project', 'remove', name.trim()]);
                break;
            }

            case '0':
                running = false;
                continue;

            default:
                console.log('\nInvalid option.');
        }

        if (running) {
            await rl.question('\nPress Enter to continue...');
        }
    }
}

async function repositoryMenu() {
    console.clear();

    console.log('\n========== GITHUB REPOSITORY ==========\n');
    console.log('  1. Inspect Repository');
    console.log('  0. Back to Main Menu');

    const choice = (await rl.question('\nSelect an option: ')).trim();

    if (choice === '1') {
        const repository = await rl.question(
            '\nEnter repository (owner/repo): '
        );

        await runCLI(['repo', 'inspect', repository.trim()]);
        await rl.question('\nPress Enter to continue...');
    } else if (choice !== '0') {
        console.log('\nInvalid option.');
        await rl.question('\nPress Enter to continue...');
    }
}

async function startMenu() {
    let running = true;

    try {
        while (running) {
            displayMenu();

            const choice = (await rl.question('\nSelect an option: ')).trim();

            switch (choice) {
                case '1':
                    await projectMenu();
                    break;

                case '2':
                    console.log('\nTask Management is coming soon.');
                    await rl.question('\nPress Enter to continue...');
                    break;

                case '3':
                    await repositoryMenu();
                    break;

                case '4':
                    console.log('\nDashboard is coming soon.');
                    await rl.question('\nPress Enter to continue...');
                    break;

                case '5':
                    console.log('\nReports are coming soon.');
                    await rl.question('\nPress Enter to continue...');
                    break;

                case '0':
                    console.log('\nThank you for using DevTrack CLI!');
                    running = false;
                    break;

                default:
                    console.log('\nInvalid option. Please try again.');
                    await rl.question('\nPress Enter to continue...');
            }
        }
    } finally {
        rl.close();
    }
}

startMenu().catch((error) => {
    console.error('\nUnexpected error:', error.message);
    process.exitCode = 1;
});
