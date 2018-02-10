
export interface ITokenInfo {
    isContract: boolean;
    transfers?: (null)[];
    contract: ITokenContract;
    token: IToken;
    pager: ITokenPager;
    holders: ITokenHolder[];
    ethPrice: ITokenPrice;
    SRC: number;
}
export interface ITokenContract {
    address: string;
    creator: string;
    hash: string;
    timestamp: number;
    blockNumber: number;
    txsCount: number;
}
export interface IToken {
    address: string;
    name: string;
    decimals: string;
    symbol: string;
    totalSupply: string;
    owner: string;
    txsCount: number;
    transfersCount: number;
    lastUpdated: number;
    issuancesCount: number;
    holdersCount: number;
    price: ITokenPrice;
}
export interface ITokenPager {
    pageSize: number;
    holders: ITokenHoldersPager;
}
export interface ITokenHoldersPager {
    page: number;
    records: number;
    total: number;
}
export interface ITokenHolder {
    address: string;
    balance: number;
}

export interface ITokenPrice {
    rate: string;
    diff: number;
    diff7d: number;
    ts: string;
    marketCapUsd: string;
    availableSupply: string;
    volume24h: string;
    currency?: string;
}

export interface ITokenSnapshot {
    dateMs: number;
    holders: ITokenHolder[];
}

export interface ILazyTokenSnapshot {
    get: () => Promise<ITokenSnapshot>;
}

export interface IUIModelTokenHolder {
    address: string;
    balance: number;
}
export interface IUIModel {
    dateMs: number;
    initialTokenHoldersCount: number;
    eligibleBonusTokenHolders: IUIModelTokenHolder[];
}