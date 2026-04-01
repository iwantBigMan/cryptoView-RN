import {ExchangeType} from './Exchange';

/** domain 레벨 계좌 잔고 (거래소 무관 통합 타입) */
export interface AccountBalance {
  exchange: ExchangeType;
  currency: string;
  balance: number;
  locked: number;
  avgBuyPrice: number | null;
}

/** domain 레벨 시세 */
export interface TickerPrice {
  exchange: ExchangeType;
  symbol: string;
  currentPrice: number;
  changePercent: number;
}
