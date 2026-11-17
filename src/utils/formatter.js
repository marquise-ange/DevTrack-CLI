
export function formatHeading(title) {
    console.log('\n========================================');
    console.log(`  ${title.toUpperCase()}`);
    console.log('========================================\n');
}

export function formatPercentage(value, total) {
    if (!total) return '0%';
    return `${Math.round((value / total) * 100)}%`;
}

export function formatDate(date) {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString();
}

export function formatStat(label, value) {
    return `${label.padEnd(22)} ${value}`;
}
