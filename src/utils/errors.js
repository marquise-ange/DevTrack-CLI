import { errorMessage } from './formatter.js';

export class DevTrackError extends Error {
    constructor(message, exitCode = 1) {
        super(message);
        this.name = 'DevTrackError';
        this.exitCode = exitCode;
    }
}

export function handleError(error) {
    if (error instanceof DevTrackError) {
        errorMessage(error.message);
        process.exitCode = error.exitCode;
        return;
    }

    errorMessage(`Unexpected error: ${error.message}`);
    process.exitCode = 1;
}

export function validateRequired(value, fieldName) {
    if (!value || !String(value).trim()) {
        throw new DevTrackError(`${fieldName} is required.`);
    }
}