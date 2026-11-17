
import { readData } from '../storage/dataStore.js';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';

export async function generateReport() {
    const data = await readData();

    const completed = data.tasks.filter(t => t.status === 'completed');
    const pending = data.tasks.filter(t => t.status !== 'completed');

    const overdue = pending.filter(t =>
        t.dueDate &&
        t.dueDate < new Date().toISOString().slice(0, 10)
    );

    const report = {
        generatedAt: new Date().toISOString(),
        summary: {
            totalProjects: data.projects.length,
            totalTasks: data.tasks.length,
            completedTasks: completed.length,
            pendingTasks: pending.length,
            overdueTasks: overdue.length,
        },
        projects: data.projects.map(project => ({
            id: project.id,
            name: project.name,
            tasks: data.tasks.filter(t => t.projectId === project.id).length,
            completed: data.tasks.filter(
                t => t.projectId === project.id && t.status === 'completed'
            ).length,
        })),
        tasks: data.tasks,
    };

    const directory = join(homedir(), '.devtrack', 'reports');

    await mkdir(directory, { recursive: true });

    const filename = `report-${Date.now()}.json`;

    await writeFile(
        join(directory, filename),
        JSON.stringify(report, null, 2),
        'utf8'
    );

    console.log('\n========== PRODUCTIVITY REPORT ==========\n');
    console.log(`Projects: ${report.summary.totalProjects}`);
    console.log(`Total Tasks: ${report.summary.totalTasks}`);
    console.log(`Completed: ${report.summary.completedTasks}`);
    console.log(`Pending: ${report.summary.pendingTasks}`);
    console.log(`Overdue: ${report.summary.overdueTasks}`);
    console.log(`\nReport saved to: ${join(directory, filename)}`);
}
