import * as ccxt from 'ccxt';

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
export const CEX = Object.freeze({
  BINANCE: 'binance',
  OKX: 'okx',
  MEXC: 'mexc',
  KUCOIN: 'kucoin',
  BITGET: 'bitget',
  BYBIT: 'bybit',
  HUOBI: 'huobi',
  GATEIO: 'gateio',
  LBANK: 'lbank',
});
export interface WithdrawParams {
  coin: string;
  amount: number;
  address: string;
  network?: string; // Specify network (e.g., 'ETH', 'BSC', 'TRX', etc.)
  memo?: string; // Required for some coins like XRP
  tag?: string; // Required for some coins
}
