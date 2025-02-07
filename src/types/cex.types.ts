import * as ccxt from 'ccxt';

export type WalletType = 'spot' | 'funding';
export interface ITicker {
  exchange: string;
  ticker: ccxt.Ticker;
  timestamp: number;
  last: number;
}
export interface IWalletBalance {
  [key: string]: number;
}
export interface ITickerRecords {
  [key: string]: ITicker[];
}
export interface ITickers {
  [key: string]: ccxt.Ticker;
}

export interface IMultiTickers {
  exchange: string;
  tickers: ITickers;
}
export interface IListenTicker {
  symbol: string;
  minExchange: string;
  minPrice: number;
  maxExchange: string;
  maxPrice: number;
  priceDiff: number;
  diffPercentage: number;
  [key: string]: string | number;
}

interface IExchangeStats {
  maxExCount: number;
  maxExPct: number;
  minExCount: number;
  minExPct: number;
}

export interface IExchangeAnalysis {
  symbol: string;
  totalRows: number;
  satisfiedPctCount: number;
  satisfiedProfitPctAvg: number;
  averageSatisfiedTime: string;
  startTimestamp: number | string;
  endTimestamp: number | string;
  duration: string;
  exchanges: {
    [key: string]: IExchangeStats;
  };
}
export interface ISimulationResult {
  success: boolean;
  data: Record<string, IWalletBalance>;
  simulationResults?: string[];
  warnings?: string[];
  error?: string | null;
}

export const CEX = Object.freeze({
  BINANCE: 'binance',
  OKX: 'okx',
  MEXC: 'mexc',
  BITGET: 'bitget',
  BYBIT: 'bybit',
  HUOBI: 'huobi',
});

export interface WithdrawParams {
  coin: string;
  amount: number;
  address: string;
  network: string; // Specify network from CHAIN_{CEX}
  memo?: string; // Required for some coins like XRP
  tag?: string; // Required for some coins
  chain?: string; // Specify chain from CHAIN_{CEX}
}

export interface ICurrencyInterface extends ccxt.CurrencyInterface {
  fees: {
    [key: string]: number;
  };
}

export const CHAIN_BN = Object.freeze({
  APTOS: 'APT',
  ARBITRUM: 'ARBITRUM',
  AVAXC: 'AVAXC',
  BASE: 'BASE',
  BSC: 'BEP20',
  OPTIMISM: 'OPTIMISM',
  SOL: 'SOL',
  TON: 'TON',
  TRON: 'TRC20',
});
export const CHAIN_OKX = Object.freeze({
  APTOS: 'APT',
  ARBITRUM: 'ARBONE',
  AVAXC: 'AVAXC',
  BASE: 'BASE',
  BSC: 'BEP20',
  OPTIMISM: 'OPTIMISM',
  SOL: 'SOL',
  TON: 'TON',
  TRON: 'TRC20',
});
export const CHAIN_BG = Object.freeze({
  APTOS: 'APT',
  ARBITRUM: 'ARB',
  AVAXC: 'AVAXC-CHAIN',
  BASE: 'BASE',
  BSC: 'BEP20',
  OPTIMISM: 'OPTIMISM',
  SOL: 'SOL',
  TON: 'TON',
  TRON: 'TRC20',
});
export const CHAIN_BB = Object.freeze({
  APTOS: 'APTOS',
  ARBITRUM: 'ARBI',
  AVAXC: 'CAVAX',
  BASE: 'BASE',
  BSC: 'BEP20',
  OPTIMISM: 'OP',
  SOL: 'SPL',
  TON: 'TON',
  TRON: 'TRC20',
});
export const CHAIN_MX = Object.freeze({
  APTOS: 'APTOS',
  ARBITRUM: 'ARB',
  AVAXC: 'AVAXC',
  BASE: 'BASE',
  BSC: 'BEP20',
  OPTIMISM: 'OPTIMISM',
  SOL: 'SOL',
  TON: 'TON',
  TRON: 'TRC20',
});
export const CHAIN_HTX = Object.freeze({
  ARBITRUM: 'ARB',
  AVAXC: 'AVAXCCHAIN',
  BSC: 'BEP20',
  SOL: 'SOL',
  TRON: 'TRC20',
});

const mockSimulation = {
  binance: {
    USDT: 1055,
    PENGU: 8586.071591026492,
    ARB: 1954.8812970936503,
    HBAR: 9915.775354855561,
  },
  okx: {
    USDT: 1045,
    PENGU: 8105.628758876589,
    ARB: 1977.441912925784,
    HBAR: 9936.975593162273,
  },
  huobi: {
    USDT: 865,
    PENGU: 22881.67938931297,
    ARB: 2000,
    HBAR: 10000.018406797844,
  },
  mexc: {
    USDT: 980,
    PENGU: 11451.220704897112,
    ARB: 1966.1501425385802,
    HBAR: 10084.218634645136,
  },
  bitget: {
    USDT: 1025,
    PENGU: 46.81236889638353,
    ARB: 2113.147823231857,
    HBAR: 10127.249823330461,
  },
  bybit: {
    USDT: 1030,
    PENGU: 9061.644921777483,
    ARB: 1988.7184115523467,
    HBAR: 9936.857750971163,
  },
};
