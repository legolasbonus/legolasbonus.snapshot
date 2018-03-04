import buildUrl = require('build-url');
import sleep = require('thread-sleep');
import fetch from 'node-fetch';
import { ITokenSnapshot, IWeb3Event, IWeb3Block, ITokenBalanceMap, ITokenBonusMap } from '../interfaces';
import {BigNumber} from 'bignumber.js';

const Web3 = require('web3');

export async function getTokenSnapshot (tokenContractAddress: string, tokenContractAbi: any[], tokenDecimals: number, apiUrl: string): Promise<ITokenSnapshot> {
    const web3 = new Web3(new Web3.providers.HttpProvider(apiUrl));
    const contract = new web3.eth.Contract(tokenContractAbi, tokenContractAddress);
    const getPastEvents = (key: string) => contract.getPastEvents(key, {
        fromBlock: 0,
        toBlock: 'latest'
    });

    const allocateEvents: IWeb3Event[] = await getPastEvents('Allocate');
    const transferEvents: IWeb3Event[]  = await getPastEvents('Transfer');

    const initialBalances: ITokenBalanceMap = {};
    const curBalances: ITokenBalanceMap = {};
    const bonusRights: ITokenBonusMap = {};
    const addresses: string[] = [];
    const onePercentage = 181415052000000; /* 1% of total supply */

    // as a temp hack;
    // 90M tokens have not yet been allocated!
    allocateEvents.push(<any>{
        returnValues: {
            _address: '0',
            _value: new BigNumber(onePercentage).multipliedBy(20).toString() /* advisors 5% + founders 15% */
        }
    });

    for (const allocateEvent of allocateEvents) {
        const amount = new BigNumber(allocateEvent.returnValues._value);
        const address = allocateEvent.returnValues._address.toLowerCase();

        curBalances[address] = amount;
        initialBalances[address] = amount;

        bonusRights[address] = true;
        addresses.push(address);
    }

    for (const transferEvent of transferEvents) {
        const fromAddress = transferEvent.returnValues._from.toLowerCase();
        const toAddress = transferEvent.returnValues._to.toLowerCase();
        const value = transferEvent.returnValues._value;

        if (bonusRights[fromAddress]) {
            curBalances[fromAddress] = curBalances[fromAddress].minus(value);
            if (curBalances[fromAddress].isLessThan(initialBalances[fromAddress])) {
                bonusRights[fromAddress] = false;
            }
        }

        if (bonusRights[toAddress]) {
            curBalances[toAddress] = curBalances[toAddress].plus(value);
            if (curBalances[toAddress].isLessThan(initialBalances[toAddress])) {
                bonusRights[toAddress] = false;
            }
        }
    }

    let numberOfPeopleWhoLostBonus = 0;
    let totalLgoTokensEligibleForBonus = new BigNumber(0);

    const quarterBonusSupply = new BigNumber(onePercentage)
        .multipliedBy(20) /* bonus is 20% of total supply */
        .dividedBy(4); /* we get bonus every six months for 2 years */

    for (const address of addresses) {
        if (bonusRights[address]) {
            totalLgoTokensEligibleForBonus = totalLgoTokensEligibleForBonus.plus(initialBalances[address]);
        } else {
            numberOfPeopleWhoLostBonus++;
        }
    }

    const bonusFactor = quarterBonusSupply.toNumber() / totalLgoTokensEligibleForBonus.toNumber();
    const eligibleBonusTokenHolders: ITokenBalanceMap = {};

    for (const address of addresses) {
        if (bonusRights[address]) {
            const amount = (bonusFactor * initialBalances[address].toNumber()).toFixed(0);
            eligibleBonusTokenHolders[address] = new BigNumber(amount)
                .dividedBy(Math.pow(10, tokenDecimals));
        }
    }

    return {
        dateMs: new Date().getTime(),
        eligibleBonusTokenHolders: eligibleBonusTokenHolders,
        numberOfPeopleWhoLostBonus: numberOfPeopleWhoLostBonus
    };
}