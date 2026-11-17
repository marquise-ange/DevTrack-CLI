
import { readData, writeData } from '../storage/dataStore.js';

import {
    validateName,
    validatePriority,
    validateStatus,
    validateDate,
} from '../utils/validators.js';

import {
    formatHeading,
    displayTable,
    success,
    errorMessage,
} from '../utils/formatter.js';

export async function addTask(
    title,
    projectIdentifier,
    priority = 'medium',
    dueDate = ''
) {
    title = title?.trim();
    priority = priority.toLowerCase();

    if (!validateName(title)) {
        errorMessage('Task title must contain at least 2 characters.');
        process.exitCode = 1;
        return;
    }

    if (!validatePriority(priority)) {
        errorMessage('Priority must be low, medium, or high.');
        process.exitCode = 1;
        return;
    }

    if (!validateDate(dueDate)) {
        errorMessage('Due date must use YYYY-MM-DD.');
        process.exitCode = 1;
        return;
    }

    const data = await readData();

    const project = data.projects.find(p =>
        p.name.toLowerCase() === String(projectIdentifier).toLowerCase() ||
        String(p.id) === String(projectIdentifier)
    );

    if (!project) {
        errorMessage('Project not found. Create a project first.');
        process.exitCode = 1;
        return;
    }

    const task = {
        id: Date.now(),
        title,
        projectId: project.id,
        priority,
        status: 'todo',
        dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    data.tasks.push(task);
    await writeData(data);

    success(`Task "${title}" created successfully!`);
}

export async function listTasks(projectIdentifier) {
    const data = await readData();

    let tasks = data.tasks;

    if (projectIdentifier) {
        const project = data.projects.find(p =>
            p.name.toLowerCase() === String(projectIdentifier).toLowerCase() ||
            String(p.id) === String(projectIdentifier)
        );

        if (!project) {
            errorMessage('Project not found.');
            process.exitCode = 1;
            return;
        }

        tasks = tasks.filter(t => t.projectId === project.id);
    }

    if (!tasks.length) {
        errorMessage('No tasks found.');
        return;
    }

    formatHeading('Task List');

    const rows = tasks.map(task => {
        const project = data.projects.find(
            p => p.id === task.projectId
        );

        return [
            String(task.id),
            task.title,
            project?.name || 'Unknown',
            task.priority.toUpperCase(),
            task.status.toUpperCase(),
            task.dueDate || 'Not set',
        ];
    });

    displayTable(
        ['ID', 'TASK', 'PROJECT', 'PRIORITY', 'STATUS', 'DUE DATE'],
        rows
    );

    success(`${tasks.length} task(s) displayed successfully.`);
}

export async function updateTask(identifier, updates = {}) {
    const data = await readData();

    const task = data.tasks.find(t =>
        String(t.id) === String(identifier) ||
        t.title.toLowerCase() === String(identifier).toLowerCase()
    );

    if (!task) {
        errorMessage('Task not found.');
        process.exitCode = 1;
        return;
    }

    if (updates.title !== undefined) {
        if (!validateName(updates.title.trim())) {
            errorMessage('Invalid task title.');
            process.exitCode = 1;
            return;
        }

        task.title = updates.title.trim();
    }

    if (updates.status !== undefined) {
        const status = updates.status.toLowerCase();

        if (!validateStatus(status)) {
            errorMessage('Status must be todo, in-progress, or completed.');
            process.exitCode = 1;
            return;
        }

        task.status = status;
    }

    if (updates.priority !== undefined) {
        const priority = updates.priority.toLowerCase();

        if (!validatePriority(priority)) {
            errorMessage('Invalid priority.');
            process.exitCode = 1;
            return;
        }

        task.priority = priority;
    }

    if (updates.dueDate !== undefined) {
        if (!validateDate(updates.dueDate)) {
            errorMessage('Invalid due date.');
            process.exitCode = 1;
            return;
        }

        task.dueDate = updates.dueDate;
    }

    task.updatedAt = new Date().toISOString();

    await writeData(data);

    success('Task updated successfully!');
}

export async function removeTask(identifier) {
    const data = await readData();

    const index = data.tasks.findIndex(t =>
        String(t.id) === String(identifier) ||
        t.title.toLowerCase() === String(identifier).toLowerCase()
    );

    if (index === -1) {
        errorMessage('Task not found.');
        process.exitCode = 1;
        return;
    }

    const removed = data.tasks.splice(index, 1)[0];

    await writeData(data);

    success(`Task "${removed.title}" deleted successfully.`);
}
