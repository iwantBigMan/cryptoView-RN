import {ExchangeType} from './Exchange';

export interface HoldingData {
  symbol: string;
  name: string;
  balance: number;
  totalValue: number;
  change: number;
  changePercent: number;
  exchange: ExchangeType;
}

export interface AggregatedHolding {
  normalizedSymbol: string;
  name: string;
  totalBalance: number;
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
  holdings: HoldingData[];
  exchanges: ExchangeType[];
}

export interface ExchangeData {
  exchange: ExchangeType;
  totalValue: number;
}
