
import { readData, writeData } from '../storage/dataStore.js';
import {
    validateName,
    validatePriority,
    validateStatus,
    validateDate,
} from '../utils/validators.js';

export async function addTask(title, projectIdentifier, priority = 'medium', dueDate = '') {
    title = title?.trim();
    priority = priority.toLowerCase();

    if (!validateName(title)) {
        console.log('Task title must contain at least 2 characters.');
        return;
    }

    if (!validatePriority(priority)) {
        console.log('Priority must be low, medium, or high.');
        return;
    }

    if (!validateDate(dueDate)) {
        console.log('Due date must use YYYY-MM-DD.');
        return;
    }

    const data = await readData();

    const project = data.projects.find(p =>
        p.name.toLowerCase() === String(projectIdentifier).toLowerCase() ||
        String(p.id) === String(projectIdentifier)
    );

    if (!project) {
        console.log('Project not found. Create a project first.');
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

    console.log(`Task "${title}" created successfully!`);
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
            console.log('Project not found.');
            return;
        }

        tasks = tasks.filter(t => t.projectId === project.id);
    }

    if (!tasks.length) {
        console.log('No tasks found.');
        return;
    }

    console.log('\n========== TASK LIST ==========\n');

    tasks.forEach((task, index) => {
        const project = data.projects.find(p => p.id === task.projectId);

        console.log(`${index + 1}. ${task.title}`);
        console.log(`   Project: ${project?.name || 'Unknown'}`);
        console.log(`   Status: ${task.status}`);
        console.log(`   Priority: ${task.priority}`);
        console.log(`   Due: ${task.dueDate || 'Not set'}`);
        console.log(`   ID: ${task.id}\n`);
    });
}

export async function updateTask(identifier, updates = {}) {
    const data = await readData();

    const task = data.tasks.find(t =>
        String(t.id) === String(identifier) ||
        t.title.toLowerCase() === String(identifier).toLowerCase()
    );

    if (!task) {
        console.log('Task not found.');
        return;
    }

    if (updates.title !== undefined) {
        if (!validateName(updates.title.trim())) {
            console.log('Invalid task title.');
            return;
        }
        task.title = updates.title.trim();
    }

    if (updates.status !== undefined) {
        const status = updates.status.toLowerCase();
        if (!validateStatus(status)) {
            console.log('Status must be todo, in-progress, or completed.');
            return;
        }
        task.status = status;
    }

    if (updates.priority !== undefined) {
        const priority = updates.priority.toLowerCase();
        if (!validatePriority(priority)) {
            console.log('Invalid priority.');
            return;
        }
        task.priority = priority;
    }

    if (updates.dueDate !== undefined) {
        if (!validateDate(updates.dueDate)) {
            console.log('Invalid due date.');
            return;
        }
        task.dueDate = updates.dueDate;
    }

    task.updatedAt = new Date().toISOString();

    await writeData(data);
    console.log('Task updated successfully!');
}

export async function removeTask(identifier) {
    const data = await readData();

    const index = data.tasks.findIndex(t =>
        String(t.id) === String(identifier) ||
        t.title.toLowerCase() === String(identifier).toLowerCase()
    );

    if (index === -1) {
        console.log('Task not found.');
        return;
    }

    const removed = data.tasks.splice(index, 1)[0];

    await writeData(data);
    console.log(`Task "${removed.title}" deleted successfully.`);
}
