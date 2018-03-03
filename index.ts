import { tokenContractAddress, tokenContractAbi, tokenDecimals } from './settings';
import { getTokenSnapshot } from './services/tokenSnapshotService';
import { saveTokenSnapshot } from './services/tokenPersistService';
import {BigNumber} from 'bignumber.js';

(async function () {

    BigNumber.config({DECIMAL_PLACES: 0});

    const args = process.argv;
    if (args.length !== 3) {
        console.error ('Usage: npm run start <JSON RPC URL>');
        return;
    }

    const apiUrl = args[2];
    const tokenSnapshot = await getTokenSnapshot(tokenContractAddress, tokenContractAbi, tokenDecimals, apiUrl);

    await saveTokenSnapshot(tokenSnapshot);
})()