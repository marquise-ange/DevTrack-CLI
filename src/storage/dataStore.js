
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';

const DATA_DIRECTORY = join(homedir(), '.devtrack');
const DATA_FILE = join(DATA_DIRECTORY, 'data.json');

const initialData = {
    projects: [],
    tasks: [],
};

export async function readData() {
    await mkdir(DATA_DIRECTORY, { recursive: true });

    try {
        const content = await readFile(DATA_FILE, 'utf8');
        const data = JSON.parse(content);

        if (!Array.isArray(data.projects) || !Array.isArray(data.tasks)) {
            throw new Error('Invalid DevTrack data structure.');
        }

        return data;
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }

        await writeData(initialData);
        return structuredClone(initialData);
    }
}

export async function writeData(data) {
    await mkdir(DATA_DIRECTORY, { recursive: true });

    const temporaryFile = `${DATA_FILE}.tmp`;

    await writeFile(
        temporaryFile,
        JSON.stringify(data, null, 2),
        'utf8'
    );

    const { rename } = await import('node:fs/promises');
    await rename(temporaryFile, DATA_FILE);
}

export async function getDataFilePath() {
    return DATA_FILE;
}
