
import { readData, writeData } from '../storage/dataStore.js';
import { validateName } from '../utils/validators.js';

import {
    formatHeading,
    displayTable,
    success,
    errorMessage,
} from '../utils/formatter.js';

export async function addProject(name) {
    name = name?.trim();

    if (!validateName(name)) {
        errorMessage('Project name must contain at least 2 characters.');
        process.exitCode = 1;
        return;
    }

    const data = await readData();

    if (
        data.projects.some(
            p => p.name.toLowerCase() === name.toLowerCase()
        )
    ) {
        errorMessage('This project already exists.');
        process.exitCode = 1;
        return;
    }

    const project = {
        id: Date.now(),
        name,
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    data.projects.push(project);
    await writeData(data);

    success(`Project "${name}" created successfully!`);
}

export async function listProjects() {
    const data = await readData();

    if (!data.projects.length) {
        errorMessage('No projects found.');
        return;
    }

    formatHeading('Your Projects');

    const rows = data.projects.map(project => {
        const tasks = data.tasks.filter(
            task => task.projectId === project.id
        );

        const completed = tasks.filter(
            task => task.status === 'completed'
        ).length;

        return [
            String(project.id),
            project.name,
            String(tasks.length),
            `${completed}/${tasks.length}`,
        ];
    });

    displayTable(
        ['ID', 'PROJECT', 'TOTAL TASKS', 'COMPLETED'],
        rows
    );

    success(`${data.projects.length} project(s) displayed successfully.`);
}

export async function showProject(identifier) {
    const data = await readData();

    const project = data.projects.find(p =>
        p.name.toLowerCase() === String(identifier).toLowerCase() ||
        String(p.id) === String(identifier)
    );

    if (!project) {
        errorMessage('Project not found.');
        process.exitCode = 1;
        return;
    }

    const tasks = data.tasks.filter(
        task => task.projectId === project.id
    );

    const completed = tasks.filter(
        task => task.status === 'completed'
    ).length;

    formatHeading('Project Details');

    displayTable(
        ['DETAIL', 'INFORMATION'],
        [
            ['ID', String(project.id)],
            ['Name', project.name],
            ['Description', project.description || 'No description'],
            ['Created', new Date(project.createdAt).toLocaleString()],
            ['Total Tasks', String(tasks.length)],
            ['Completed Tasks', String(completed)],
        ]
    );

    success('Project details loaded successfully.');
}

export async function updateProject(
    identifier,
    newName,
    description = ''
) {
    const data = await readData();

    const project = data.projects.find(p =>
        p.name.toLowerCase() === String(identifier).toLowerCase() ||
        String(p.id) === String(identifier)
    );

    if (!project) {
        errorMessage('Project not found.');
        process.exitCode = 1;
        return;
    }

    if (newName?.trim()) {
        const trimmedName = newName.trim();

        if (!validateName(trimmedName)) {
            errorMessage('Project name must contain at least 2 characters.');
            process.exitCode = 1;
            return;
        }

        const duplicate = data.projects.some(p =>
            p.id !== project.id &&
            p.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (duplicate) {
            errorMessage('Another project already uses that name.');
            process.exitCode = 1;
            return;
        }

        project.name = trimmedName;
    }

    if (description !== undefined) {
        project.description = description.trim();
    }

    project.updatedAt = new Date().toISOString();

    await writeData(data);

    success('Project updated successfully!');
}

export async function removeProject(identifier) {
    const data = await readData();

    const index = data.projects.findIndex(p =>
        p.name.toLowerCase() === String(identifier).toLowerCase() ||
        String(p.id) === String(identifier)
    );

    if (index === -1) {
        errorMessage('Project not found.');
        process.exitCode = 1;
        return;
    }

    const project = data.projects[index];

    const linkedTasks = data.tasks.filter(
        task => task.projectId === project.id
    );

    if (linkedTasks.length) {
        errorMessage(
            `Cannot delete "${project.name}": it has ${linkedTasks.length} linked tasks.`
        );

        console.log('Delete or reassign those tasks first.');

        process.exitCode = 1;
        return;
    }

    data.projects.splice(index, 1);
    await writeData(data);

    success(`Project "${project.name}" deleted successfully.`);
}
