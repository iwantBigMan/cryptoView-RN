export enum ExchangeType {
  UPBIT = 'UPBIT',
  GATEIO = 'GATEIO',
}

export const ExchangeDisplayName: Record<ExchangeType, string> = {
  [ExchangeType.UPBIT]: 'Upbit',
  [ExchangeType.GATEIO]: 'Gate.io',
};

export const ExchangeColor: Record<ExchangeType, string> = {
  [ExchangeType.UPBIT]: '#3B82F6',
  [ExchangeType.GATEIO]: '#8B5CF6',
};

export enum CurrencyUnit {
  KRW = 'KRW',
  USDT = 'USDT',
}

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

export interface ExchangeHoldingDetail {
  exchange: ExchangeType;
  symbol: string;
  quantity: number;
  avgBuyPrice: number | null;
  currentPrice: number;
  currencyUnit: CurrencyUnit;
  valueKrw: number;
  profitLoss: number | null;
  profitLossPercent: number | null;
}
