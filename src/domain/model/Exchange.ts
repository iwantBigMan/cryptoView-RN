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
