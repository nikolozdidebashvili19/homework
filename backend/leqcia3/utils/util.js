import fs from 'fs/promises';

export const writeFile = async (filePath, data) => {
    data = typeof data !== 'string' ? data : JSON.stringify(data, null, 2);
await fs.writeFile(filePath, data);
}

export const readFile = async (filePath ,isParse) => {
    const data = await fs.readFile(filePath, 'utf-8');
    return isParse ? JSON.parse(readData) : readData;
}