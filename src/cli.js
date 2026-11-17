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

import {
    DevTrackError,
    handleError,
} from './utils/errors.js';

export async function runCLI(args = process.argv.slice(2)) {
    try {
        const { values, positionals } = parseArgs({
            args,
            options: {
                help: { type: 'boolean', short: 'h' },
                priority: { type: 'string', short: 'p' },
                status: { type: 'string', short: 's' },
                due: { type: 'string' },
                description: { type: 'string', short: 'd' },
                project: { type: 'string' },
                name: { type: 'string', short: 'n' },
                title: { type: 'string', short: 't' },
            },
            allowPositionals: true,
            strict: false,
        });

        const [command, action, ...rest] = positionals;
        const argument = rest.join(' ');

        if (values.help || command === 'help' || !command) {
            showHelp();
            return;
        }

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
                        await requireArgument(argument, 'Project name or ID');
                        await showProject(argument);
                        break;

                    case 'update':
                        await requireArgument(argument, 'Project name or ID');
                        await updateProject(
                            argument,
                            values.name,
                            values.description || ''
                        );
                        break;

                    case 'remove':
                        await requireArgument(argument, 'Project name or ID');
                        await removeProject(argument);
                        break;

                    default:
                        throw new DevTrackError(
                            'Invalid project action. Use add, list, show, update, or remove.'
                        );
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
                        await requireArgument(argument, 'Task title or ID');
                        await updateTask(argument, {
                            title: values.title,
                            status: values.status,
                            priority: values.priority,
                            dueDate: values.due,
                        });
                        break;

                    case 'remove':
                        await requireArgument(argument, 'Task title or ID');
                        await removeTask(argument);
                        break;

                    default:
                        throw new DevTrackError(
                            'Invalid task action. Use add, list, update, or remove.'
                        );
                }
                break;

            case 'repo':
                if (action !== 'inspect') {
                    throw new DevTrackError(
                        'Invalid repository action. Use: repo inspect owner/repository'
                    );
                }

                await inspectRepository(argument);
                break;

            case 'dashboard':
                await showDashboard();
                break;

            case 'report':
                await generateReport();
                break;

            default:
                throw new DevTrackError(
                    `Unknown command: ${command}. Run devtrack --help for available commands.`
                );
        }
    } catch (error) {
        handleError(error);
    }
}

function requireArgument(value, fieldName) {
    if (!value || !value.trim()) {
        throw new DevTrackError(`${fieldName} is required.`);
    }
}

function showHelp() {
    console.log(`
========================================
             DEVTRACK CLI
      Developer Productivity Toolkit
========================================

PROJECT COMMANDS
  project add "Project Name"
  project list
  project show "Project Name"
  project remove "Project Name"

TASK COMMANDS
  task add "Task Name" --project "Project Name"
  task list
  task update "Task Name" --status completed
  task remove "Task Name"

GITHUB
  repo inspect owner/repository

PRODUCTIVITY
  dashboard
  report

OPTIONS
  -h, --help
  -p, --priority
  -s, --status
  -d, --description
  --due
  --project
`);
}