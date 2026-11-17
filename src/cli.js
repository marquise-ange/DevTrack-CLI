import { parseArgs } from 'node:util';

import {
    addProject,
    listProjects,
    showProject,
    updateProject,
    removeProject,
} from './commands/project.js';

import {
    addTask,
    listTasks,
    updateTask,
    removeTask,
} from './commands/task.js';

import { inspectRepository } from './commands/repo.js';
import { showDashboard } from './commands/dashboard.js';
import { generateReport } from './commands/report.js';

export async function runCLI(args = process.argv.slice(2)) {
    const { values, positionals } = parseArgs({
        args,
        options: {
            help: { type: 'boolean', short: 'h' },
            priority: { type: 'string', short: 'p' },
            status: { type: 'string', short: 's' },
            due: { type: 'string' },
            description: { type: 'string', short: 'd' },
            project: { type: 'string' },
        },
        allowPositionals: true,
        strict: false,
    });

    const [command, action, ...rest] = positionals;
    const argument = rest.join(' ');

    if (values.help || command === 'help') {
        showHelp();
        return;
    }

    try {
        switch (command) {
            case 'project':
                switch (action) {
                    case 'add':
                        await addProject(argument);
                        break;
                    case 'list':
                        await listProjects();
                        break;
                    case 'show':
                        await showProject(argument);
                        break;
                    case 'update':
                        await updateProject(
                            argument,
                            values.name,
                            values.description || ''
                        );
                        break;
                    case 'remove':
                        await removeProject(argument);
                        break;
                    default:
                        console.log('Project actions: add, list, show, update, remove');
                }
                break;

            case 'task':
                switch (action) {
                    case 'add':
                        await addTask(
                            argument,
                            values.project,
                            values.priority || 'medium',
                            values.due || ''
                        );
                        break;
                    case 'list':
                        await listTasks(values.project);
                        break;
                    case 'update':
                        await updateTask(argument, {
                            title: values.title,
                            status: values.status,
                            priority: values.priority,
                            dueDate: values.due,
                        });
                        break;
                    case 'remove':
                        await removeTask(argument);
                        break;
                    default:
                        console.log('Task actions: add, list, update, remove');
                }
                break;

            case 'repo':
                if (action === 'inspect') {
                    await inspectRepository(argument);
                } else {
                    console.log('Repository action: inspect');
                }
                break;

            case 'dashboard':
                await showDashboard();
                break;

            case 'report':
                await generateReport();
                break;

            default:
                console.log('Unknown command. Run devtrack --help.');
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exitCode = 1;
    }
}

function showHelp() {
    console.log(`
`);
}