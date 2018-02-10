import { ITokenSnapshot, ILazyTokenSnapshot, ITokenHolder } from '../interfaces';
import { keyBy } from 'lodash';

export async function getEligibleBonusTokenHolders (tokenSnapshots: ILazyTokenSnapshot[]): Promise<ITokenHolder[]> {
    const initialLazyTokenSnapshot = tokenSnapshots[0];
    const initialTokenSnapshot = await initialLazyTokenSnapshot.get();
    const initialHolderLookup = keyBy(initialTokenSnapshot.holders, (t) => t.address);
    const bonusLostFor: any = {};

    // let's go through all the snapshots we have,
    // and compare it with the initial token snapshot
    for (const lazyTokenSnapshot of tokenSnapshots) {
        if (lazyTokenSnapshot === initialLazyTokenSnapshot) {
            continue;
        }

        const tokenSnapshot = await lazyTokenSnapshot.get();

        for (const holder of tokenSnapshot.holders) {
            const initialHolder = initialHolderLookup[holder.address];
            if (!initialHolder) {
                continue;
            }

            if (holder.balance < initialHolder.balance) {
                bonusLostFor[holder.address] = true;
            }
        }
    }

    let eligibleBonus = 0;
    let tokenHolders: ITokenHolder[] = [];

    for (const holder of initialTokenSnapshot.holders) {
        if (!bonusLostFor[holder.address]) {
            tokenHolders.push(holder);
        }
    }

    return tokenHolders;
}