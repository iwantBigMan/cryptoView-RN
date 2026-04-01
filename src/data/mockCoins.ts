import {
  ExchangeType,
  CurrencyUnit,
} from '../domain/model/Exchange';
import type {HoldingData, AggregatedHolding, ExchangeData} from '../domain/model/Holding';
import type {ExchangeHoldingDetail} from '../domain/model/HoldingDetail';

// 보유 코인 목 데이터
export const mockHoldings: HoldingData[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    balance: 0.5,
    totalValue: 44250000,
    change: 1750000,
    changePercent: 4.12,
    exchange: ExchangeType.UPBIT,
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    balance: 0.3,
    totalValue: 26334000,
    change: 0,
    changePercent: 0,
    exchange: ExchangeType.GATEIO,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 5.2,
    totalValue: 17784000,
    change: -320000,
    changePercent: -1.77,
    exchange: ExchangeType.UPBIT,
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    balance: 30,
    totalValue: 4278000,
    change: 223000,
    changePercent: 5.51,
    exchange: ExchangeType.UPBIT,
  },
  {
    symbol: 'XRP',
    name: 'XRP',
    balance: 5000,
    totalValue: 3117000,
    change: -14000,
    changePercent: -0.45,
    exchange: ExchangeType.UPBIT,
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    balance: 10000,
    totalValue: 4521000,
    change: 141000,
    changePercent: 3.22,
    exchange: ExchangeType.GATEIO,
  },
];

// 심볼 기준 통합 보유 데이터
export const mockAggregatedHoldings: AggregatedHolding[] = [
  {
    normalizedSymbol: 'BTC',
    name: 'Bitcoin',
    totalBalance: 0.8,
    totalValue: 70584000,
    totalChange: 1750000,
    totalChangePercent: 2.54,
    holdings: [mockHoldings[0], mockHoldings[1]],
    exchanges: [ExchangeType.UPBIT, ExchangeType.GATEIO],
  },
  {
    normalizedSymbol: 'ETH',
    name: 'Ethereum',
    totalBalance: 5.2,
    totalValue: 17784000,
    totalChange: -320000,
    totalChangePercent: -1.77,
    holdings: [mockHoldings[2]],
    exchanges: [ExchangeType.UPBIT],
  },
  {
    normalizedSymbol: 'ADA',
    name: 'Cardano',
    totalBalance: 10000,
    totalValue: 4521000,
    totalChange: 141000,
    totalChangePercent: 3.22,
    holdings: [mockHoldings[5]],
    exchanges: [ExchangeType.GATEIO],
  },
  {
    normalizedSymbol: 'SOL',
    name: 'Solana',
    totalBalance: 30,
    totalValue: 4278000,
    totalChange: 223000,
    totalChangePercent: 5.51,
    holdings: [mockHoldings[3]],
    exchanges: [ExchangeType.UPBIT],
  },
  {
    normalizedSymbol: 'XRP',
    name: 'XRP',
    totalBalance: 5000,
    totalValue: 3117000,
    totalChange: -14000,
    totalChangePercent: -0.45,
    holdings: [mockHoldings[4]],
    exchanges: [ExchangeType.UPBIT],
  },
];

// 거래소별 자산 요약
export const mockExchangeBreakdown: ExchangeData[] = [
  {exchange: ExchangeType.UPBIT, totalValue: 69429000},
  {exchange: ExchangeType.GATEIO, totalValue: 30855000},
];

// 거래소별 상세 보유 (BTC 예시)
export const mockExchangeHoldingDetails: ExchangeHoldingDetail[] = [
  {
    exchange: ExchangeType.UPBIT,
    symbol: 'BTC',
    quantity: 0.5,
    avgBuyPrice: 85000000,
    currentPrice: 88500000,
    currencyUnit: CurrencyUnit.KRW,
    valueKrw: 44250000,
    profitLoss: 1750000,
    profitLossPercent: 4.12,
  },
  {
    exchange: ExchangeType.GATEIO,
    symbol: 'BTC',
    quantity: 0.3,
    avgBuyPrice: null,
    currentPrice: 66500,
    currencyUnit: CurrencyUnit.USDT,
    valueKrw: 26334000,
    profitLoss: null,
    profitLossPercent: null,
  },
];

// 홈 대시보드 요약
export const mockTotalValue = 100284000;
export const mockTotalChange = 1780000;
export const mockTotalChangeRate = 1.81;

