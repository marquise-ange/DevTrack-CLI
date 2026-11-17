
import chalk from 'chalk';
import Table from 'cli-table3';

// Display a section heading
export function formatHeading(title) {
    console.log('\n' + chalk.bold.cyan('='.repeat(50)));
    console.log(chalk.bold.white(`  ${title.toUpperCase()}`));
    console.log(chalk.bold.cyan('='.repeat(50)) + '\n');
}

// Display a success message
export function success(message) {
    console.log(chalk.green(`✔ ${message}`));
}

// Display an error message
export function errorMessage(message) {
    console.error(chalk.red(`✖ ${message}`));
}

// Display a warning message
export function warning(message) {
    console.log(chalk.yellow(`⚠ ${message}`));
}

// Display an informational message
export function info(message) {
    console.log(chalk.blue(`ℹ ${message}`));
}

// Calculate completion percentage
export function formatPercentage(value, total) {
    if (!total) return '0%';

    return `${Math.round((value / total) * 100)}%`;
}

// Format dates
export function formatDate(date) {
    if (!date) return 'Not set';

    return new Date(date).toLocaleDateString();
}

// Format a statistic
export function formatStat(label, value) {
    return `${label.padEnd(22)} ${value}`;
}

// Create and display a reusable terminal table
export function displayTable(headers, rows) {
    const table = new Table({
        head: headers.map(header => chalk.cyan.bold(header)),
        style: {
            head: [],
            border: ['gray'],
        },
        wordWrap: true,
    });

    rows.forEach(row => table.push(row));

    console.log(table.toString());
}
