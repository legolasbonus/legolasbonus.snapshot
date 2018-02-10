import buildUrl = require('build-url');
import sleep = require('thread-sleep');
import fetch from 'node-fetch';
import { ITokenSnapshot, ITokenInfo } from '../interfaces';

export async function getTokenSnapshot (tokenContractAddress: string, apiUrl: string): Promise<ITokenSnapshot> {
    const tokenSnapshot: ITokenSnapshot = {
        dateMs: new Date().getTime(),
        holders: []
    };

    for (let page = 1; ; page++) {
        const url = buildUrl(apiUrl, {
            queryParams: {
                refresh: 'holders',
                data: tokenContractAddress,
                page: encodeURIComponent(`pageSize=100&tab=tab-holders&holders=${page}`)
            }
        });

        const response = await fetch(url);
        const tokenInfo: ITokenInfo = await response.json();

        // if we get a page which is not the page we requested,
        // we know that we have finished fetching.
        if (tokenInfo.pager.holders.page !== page) {
            break;
        }

        sleep(2000);

        tokenSnapshot.holders.push(...tokenInfo.holders);
    }

    return tokenSnapshot;
}