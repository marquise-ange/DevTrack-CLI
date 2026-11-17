
import { readData, writeData } from '../storage/dataStore.js';
import { validateName } from '../utils/validators.js';

export async function addProject(name) {
    name = name?.trim();

    if (!validateName(name)) {
        console.log('Error: Project name must contain at least 2 characters.');
        return;
    }

    const data = await readData();

    if (data.projects.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        console.log('Error: This project already exists.');
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

    console.log(`Project "${name}" created successfully!`);
}

export async function listProjects() {
    const data = await readData();

    if (!data.projects.length) {
        console.log('No projects found.');
        return;
    }

    console.log('\n========== YOUR PROJECTS ==========\n');

    data.projects.forEach((project, index) => {
        const tasks = data.tasks.filter(t => t.projectId === project.id);
        const completed = tasks.filter(t => t.status === 'completed').length;

        console.log(`${index + 1}. ${project.name}`);
        console.log(`   Tasks: ${completed}/${tasks.length} completed`);
        console.log(`   ID: ${project.id}\n`);
    });
}

export async function showProject(identifier) {
    const data = await readData();

    const project = data.projects.find(p =>
        p.name.toLowerCase() === String(identifier).toLowerCase() ||
        String(p.id) === String(identifier)
    );

    if (!project) {
        console.log('Project not found.');
        return;
    }

    const tasks = data.tasks.filter(t => t.projectId === project.id);

    console.log('\n========== PROJECT DETAILS ==========');
    console.log(`Name: ${project.name}`);
    console.log(`Description: ${project.description || 'No description'}`);
    console.log(`Created: ${new Date(project.createdAt).toLocaleString()}`);
    console.log(`Total tasks: ${tasks.length}`);
    console.log(`Completed: ${tasks.filter(t => t.status === 'completed').length}`);
}

export async function updateProject(identifier, newName, description = '') {
    const data = await readData();

    const project = data.projects.find(p =>
        p.name.toLowerCase() === String(identifier).toLowerCase() ||
        String(p.id) === String(identifier)
    );

    if (!project) {
        console.log('Project not found.');
        return;
    }

    if (newName?.trim()) {
        if (!validateName(newName.trim())) {
            console.log('Project name must contain at least 2 characters.');
            return;
        }

        const duplicate = data.projects.some(p =>
            p.id !== project.id &&
            p.name.toLowerCase() === newName.trim().toLowerCase()
        );

        if (duplicate) {
            console.log('Another project already uses that name.');
            return;
        }

        project.name = newName.trim();
    }

    if (description !== undefined) {
        project.description = description.trim();
    }

    project.updatedAt = new Date().toISOString();

    await writeData(data);
    console.log('Project updated successfully!');
}

export async function removeProject(identifier) {
    const data = await readData();

    const index = data.projects.findIndex(p =>
        p.name.toLowerCase() === String(identifier).toLowerCase() ||
        String(p.id) === String(identifier)
    );

    if (index === -1) {
        console.log('Project not found.');
        return;
    }

    const project = data.projects[index];

    const linkedTasks = data.tasks.filter(t => t.projectId === project.id);

    if (linkedTasks.length) {
        console.log(`Cannot delete "${project.name}": it has ${linkedTasks.length} linked tasks.`);
        console.log('Delete or reassign those tasks first.');
        return;
    }

    data.projects.splice(index, 1);
    await writeData(data);

    console.log(`Project "${project.name}" deleted successfully.`);
}
