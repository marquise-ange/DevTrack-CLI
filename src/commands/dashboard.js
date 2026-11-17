
import { readData } from '../storage/dataStore.js';
import {
    formatPercentage,
    formatHeading,
    displayTable,
    success,
} from '../utils/formatter.js';

export async function showDashboard() {
    try {
        const data = await readData();

        const totalProjects = data.projects.length;
        const totalTasks = data.tasks.length;

        const completed = data.tasks.filter(
            task => task.status === 'completed'
        ).length;

        const inProgress = data.tasks.filter(
            task => task.status === 'in-progress'
        ).length;

        const todo = data.tasks.filter(
            task => task.status === 'todo'
        ).length;

        const high = data.tasks.filter(
            task => task.priority === 'high'
        ).length;

        const medium = data.tasks.filter(
            task => task.priority === 'medium'
        ).length;

        const low = data.tasks.filter(
            task => task.priority === 'low'
        ).length;

        const today = new Date().toISOString().slice(0, 10);

        const overdue = data.tasks.filter(task =>
            task.status !== 'completed' &&
            task.dueDate &&
            task.dueDate < today
        ).length;

        formatHeading('DevTrack Dashboard');

        displayTable(
            ['OVERVIEW', 'TOTAL'],
            [
                ['Projects', totalProjects],
                ['Tasks', totalTasks],
            ]
        );

        console.log('\n');

        displayTable(
            ['TASK PROGRESS', 'COUNT'],
            [
                ['Completed', completed],
                ['In Progress', inProgress],
                ['To Do', todo],
                ['Completion Rate', formatPercentage(completed, totalTasks)],
            ]
        );

        console.log('\n');

        displayTable(
            ['TASK PRIORITIES', 'COUNT'],
            [
                ['High', high],
                ['Medium', medium],
                ['Low', low],
            ]
        );

        console.log('\n');

        displayTable(
            ['OVERDUE TASKS', 'COUNT'],
            [
                ['Overdue', overdue],
            ]
        );

        success('Dashboard loaded successfully!');
    } catch (error) {
        throw error;
    }
}
