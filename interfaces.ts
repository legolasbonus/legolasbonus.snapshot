import {BigNumber} from 'bignumber.js';

export interface ITokenBalanceMap {
    [key: string]: BigNumber;
}

export interface ITokenBonusMap {
    [key: string]: boolean;
}

export interface ITokenSnapshot {
    dateMs: number;
    numberOfPeopleWhoLostBonus: number;
    eligibleBonusTokenHolders: ITokenBalanceMap;
}

export interface IWeb3EventRawData {
    data: string;
    topics: string[];
}

export interface IWeb3Event {
    address: string;
    blockHash: string;
    blockNumber: number;
    logIndex: number;
    transactionHash: string;
    transactionIndex: number;
    transactionLogIndex: string;
    type: string;
    id: string;
    returnValues: any;
    event: string;
    signature: string;
    raw: IWeb3EventRawData;
}

export interface IWeb3Transaction {
    blockHash: string;
    blockNumber: number;
    chainId: string;
    condition?: any;
    creates?: any;
    from: string;
    gas: number;
    gasPrice: string;
    hash: string;
    input: string;
    nonce: number;
    publicKey: string;
    r: string;
    raw: string;
    s: string;
    standardV: string;
    to: string;
    transactionIndex: number;
    v: string;
    value: string;
}

export interface IWeb3Block {
    author: string;
    difficulty: string;
    extraData: string;
    gasLimit: number;
    gasUsed: number;
    hash: string;
    logsBloom: string;
    miner: string;
    mixHash: string;
    nonce: string;
    number: number;
    parentHash: string;
    receiptsRoot: string;
    sealFields: string[];
    sha3Uncles: string;
    size: number;
    stateRoot: string;
    timestamp: number;
    totalDifficulty: string;
    transactions: IWeb3Transaction[];
    transactionsRoot: string;
    uncles: any[];
}
