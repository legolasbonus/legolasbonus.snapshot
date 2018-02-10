import { ITokenSnapshot, ILazyTokenSnapshot, ITokenHolder, IUIModel } from '../interfaces';
import { promisify } from 'util';
import * as fs from 'fs';
import glob = require('glob');
import { sortBy } from 'lodash';

export async function saveUiModel(tokenUiModel: IUIModel): Promise<void> {
    const writeFileAsync = promisify(fs.writeFile);
    const filename = `data-${tokenUiModel.dateMs}.json`;
    await writeFileAsync(`ui/${filename}`, JSON.stringify(tokenUiModel, null, 4));
}
