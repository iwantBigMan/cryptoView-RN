import {ExchangeType, CurrencyUnit} from './Exchange';

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
