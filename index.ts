import { tokenContractAddress, apiUrl } from './settings';
import { getTokenSnapshot } from './services/tokenSnapshotService';
import { saveTokenSnapshot, getSortedLazyTokenSnapshots } from './services/tokenSnapshotPersistService';
import { getEligibleBonusTokenHolders } from './services/tokenSnapshotTrackService';
import { saveUiModel } from './services/tokenUiModelPersistService';


(async function () {

    // step1:
    // get snapshot from the ethplorer API
    // and save it!
    // const tokenSnapshot = await getTokenSnapshot(tokenContractAddress, apiUrl);
    // await saveTokenSnapshot(tokenSnapshot);

    // step2:
    // get all the snapshots we have made
    // and calculate eligible bonus holders
    const lazyTokenSnapshots = await getSortedLazyTokenSnapshots();
    const initialTokenSnapshot = await lazyTokenSnapshots[0].get();
    const eligibleBonusTokenHolders = await getEligibleBonusTokenHolders(lazyTokenSnapshots);

    // step3:
    // persist UI model to the disk,
    // front-end will use it in the future!
    await saveUiModel({
        dateMs: new Date().getTime(),
        eligibleBonusTokenHolders: eligibleBonusTokenHolders,
        initialTokenHoldersCount: initialTokenSnapshot.holders.length
    });
})()