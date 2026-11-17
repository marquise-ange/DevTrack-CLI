
export function validateName(name) {
    return typeof name === 'string' && name.trim().length >= 2;
}

export function validatePriority(priority) {
    return ['low', 'medium', 'high'].includes(
        String(priority).toLowerCase()
    );
}

export function validateStatus(status) {
    return ['todo', 'in-progress', 'completed'].includes(
        String(status).toLowerCase()
    );
}

export function validateDate(date) {
    if (!date) return true;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

    const parsed = new Date(`${date}T00:00:00.000Z`);

    return !Number.isNaN(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === date;
}
