import * as ccxt from 'ccxt';

export interface ITicker {
  exchange: string;
  ticker: ccxt.Ticker;
  timestamp: number;
  last: number;
}
