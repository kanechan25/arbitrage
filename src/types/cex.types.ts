import * as ccxt from 'ccxt';

export type WalletType = 'spot' | 'funding';
export interface ITicker {
  exchange: string;
  ticker: ccxt.Ticker;
  timestamp: number;
  last: number;
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

export const CEX = Object.freeze({
  BINANCE: 'binance',
  OKX: 'okx',
  MEXC: 'mexc',
  BITGET: 'bitget',
  BYBIT: 'bybit',
  HUOBI: 'huobi',
});

export const CHAINS = Object.freeze({
  APTOS: 'APTOS',
  ARB: 'ARBITRUM',
  AVAX: 'AVAX',
  BASE: 'BASE',
  BSC: 'BEP20',
  OPTIMISM: 'OPTIMISM',
  SOL: 'SOL',
  TON: 'TON',
  TRON: 'TRC20',
});

export interface WithdrawParams {
  coin: string;
  amount: number;
  address: string;
  network: string; // Specify network from CHAINS{}
  memo?: string; // Required for some coins like XRP
  tag?: string; // Required for some coins
}

export interface ICurrencyInterface extends ccxt.CurrencyInterface {
  fees: {
    [key: string]: number;
  };
}
