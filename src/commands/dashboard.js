
import { readData } from '../storage/dataStore.js';
import { formatPercentage } from '../utils/formatter.js';

export async function showDashboard() {
    const data = await readData();

    const totalProjects = data.projects.length;
    const totalTasks = data.tasks.length;

    const completed = data.tasks.filter(t => t.status === 'completed').length;
    const inProgress = data.tasks.filter(t => t.status === 'in-progress').length;
    const todo = data.tasks.filter(t => t.status === 'todo').length;

    const high = data.tasks.filter(t => t.priority === 'high').length;
    const medium = data.tasks.filter(t => t.priority === 'medium').length;
    const low = data.tasks.filter(t => t.priority === 'low').length;

    const overdue = data.tasks.filter(t =>
        t.status !== 'completed' &&
        t.dueDate &&
        t.dueDate < new Date().toISOString().slice(0, 10)
    ).length;

    console.log('\n========== DEVTRACK DASHBOARD ==========\n');

    console.log(`Total Projects:       ${totalProjects}`);
    console.log(`Total Tasks:          ${totalTasks}`);

    console.log('\nTASK PROGRESS');
    console.log(`Completed:            ${completed}`);
    console.log(`In Progress:          ${inProgress}`);
    console.log(`To Do:                ${todo}`);
    console.log(`Completion Rate:      ${formatPercentage(completed, totalTasks)}`);

    console.log('\nTASK PRIORITIES');
    console.log(`High:                 ${high}`);
    console.log(`Medium:               ${medium}`);
    console.log(`Low:                  ${low}`);

    console.log(`\nOverdue Tasks:        ${overdue}`);
}
