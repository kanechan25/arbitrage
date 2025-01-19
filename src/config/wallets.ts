import { CEX, CHAINS } from '@/types/cex.types';

export const WALLETS = Object.freeze({
  [CEX.BINANCE]: {
    USDT: {
      [CHAINS.BSC]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
      [CHAINS.ARB]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
      [CHAINS.TRON]: 'TNccKLY3ajBfS55ypo1ys3XKzFuruMqwFe',
    },
    ETH: {
      [CHAINS.BSC]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
      [CHAINS.ARB]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
      [CHAINS.OPTIMISM]: '0x2fb3e06dac8fe6d8dd0aceaf7cc9f89837b6e0b8',
    },
  },
  [CEX.OKX]: {
    USDT: {
      [CHAINS.ARB]: '0x971dd7481e7e8b4261641728f4c66dbbbf69d20e',
      [CHAINS.TRON]: 'TNccKLY3ajBfS55ypo1ys3XKzFuruMqwFe',
    },
    ETH: {
      [CHAINS.ARB]: '0x971dd7481e7e8b4261641728f4c66dbbbf69d20e',
      [CHAINS.OPTIMISM]: '0x971dd7481e7e8b4261641728f4c66dbbbf69d20e',
    },
  },
  [CEX.MEXC]: {
    USDT: {
      [CHAINS.BSC]: '0x22a24dbec2d9cf058b6abf70f3778ada747deaaa',
      [CHAINS.ARB]: '0x22a24dbec2d9cf058b6abf70f3778ada747deaaa',
    },
    ETH: {
      [CHAINS.BSC]: '0x22a24dbec2d9cf058b6abf70f3778ada747deaaa',
    },
  },
  [CEX.BITGET]: {
    USDT: {
      [CHAINS.BSC]: '0xdc1ae85d9166f516eaa490c5910ac4b85f2e7e05',
    },
    ETH: {
      [CHAINS.BSC]: '0xdc1ae85d9166f516eaa490c5910ac4b85f2e7e05',
    },
  },
  [CEX.BYBIT]: {
    USDT: {
      [CHAINS.BSC]: '0x3ba13ad540796e2934c40e0c671687b139a041f5',
      [CHAINS.TRON]: 'TUgeiFZaM8PK2wrRLoyPHiy8wTzAX2EDvt',
    },
    ETH: {
      [CHAINS.BSC]: '0x3ba13ad540796e2934c40e0c671687b139a041f5',
    },
  },
  [CEX.HUOBI]: {
    USDT: {
      [CHAINS.BSC]: '0x18a61fab2d603bdb832b62dfbb3ce0b295df2227',
      [CHAINS.TRON]: 'TUFv6WUbWxtVse9QD1M8RvwoDKbRnc2txh',
    },
    ETH: {
      [CHAINS.TRON]: 'TUFv6WUbWxtVse9QD1M8RvwoDKbRnc2txh',
    },
  },
});

export const depositWallets = [
  {
    platform: CEX.MEXC,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.MEXC].USDT[CHAINS.BSC],
    network: CHAINS.BSC,
  },
  {
    platform: CEX.BITGET,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.BITGET].USDT[CHAINS.BSC],
    network: CHAINS.BSC,
  },
  {
    platform: CEX.BYBIT,
    coin: 'USDT',
    amount: 10.1,
    address: WALLETS[CEX.BYBIT].USDT[CHAINS.BSC],
    network: CHAINS.BSC,
  },
  {
    platform: CEX.HUOBI,
    coin: 'USDT',
    amount: 0,
    address: WALLETS[CEX.HUOBI].USDT[CHAINS.BSC],
    network: CHAINS.BSC,
  },
];
