import { ITokenSnapshot, ILazyTokenSnapshot } from '../interfaces';
import { promisify } from 'util';
import * as fs from 'fs';
import glob = require('glob');
import { sortBy } from 'lodash';

export async function saveTokenSnapshot(tokenSnapshot: ITokenSnapshot): Promise<void> {
    const writeFileAsync = promisify(fs.writeFile);
    const date = new Date();
    const filename = `snapshot-${tokenSnapshot.dateMs}.json`;
    await writeFileAsync(`snapshots/${filename}`, JSON.stringify(tokenSnapshot, null, 4));
}

export async function getSortedLazyTokenSnapshots(): Promise<ILazyTokenSnapshot[]> {
    const globAsync = promisify(glob);
    const readFileAsync = promisify(fs.readFile);
    const files = await globAsync('snapshots/*.json');

    const sortedFiles = sortBy(files, (file) => {
        const [_, remaining] = file.split('-');
        const [dateMs, __] = remaining.split('.');
        return new Number(dateMs);
    });

    return sortedFiles.map((file) => {
        return {
            get: async () => JSON.parse(await readFileAsync(file, 'utf-8'))
        }
    });
}