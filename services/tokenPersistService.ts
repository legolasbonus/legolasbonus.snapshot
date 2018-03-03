import { ITokenSnapshot } from '../interfaces';
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