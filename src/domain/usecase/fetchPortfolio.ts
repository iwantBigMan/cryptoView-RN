import {
  ExchangeType,
  CurrencyUnit,
} from '../model/Exchange';
import type {HoldingData, AggregatedHolding, ExchangeData} from '../model/Holding';
import type {ExchangeHoldingDetail} from '../model/HoldingDetail';
import type {AccountBalance, TickerPrice} from '../model/Account';
import type {IExchangeRepository} from '../repository/IExchangeRepository';

/** UseCase 결과 타입 */
export interface PortfolioResult {
  holdings: HoldingData[];
  aggregated: AggregatedHolding[];
  exchangeBreakdown: ExchangeData[];
  detailMap: Record<string, ExchangeHoldingDetail[]>;
  totalValue: number;
  totalChange: number;
  totalChangeRate: number;
}

const DUST_THRESHOLD = 1e-8;
const EXCLUDED_CURRENCIES = new Set(['KRW', 'USDT', 'USD', 'USDC']);

/** Upbit는 KRW, Gate.io는 USDT */
const EXCHANGE_CURRENCY: Record<ExchangeType, CurrencyUnit> = {
  [ExchangeType.UPBIT]: CurrencyUnit.KRW,
  [ExchangeType.GATEIO]: CurrencyUnit.USDT,
};

export const EMPTY_RESULT: PortfolioResult = {
  holdings: [],
  aggregated: [],
  exchangeBreakdown: [],
  detailMap: {},
  totalValue: 0,
  totalChange: 0,
  totalChangeRate: 0,
};

/**
 * 포트폴리오 전체를 로드하는 UseCase
 * Android GetPortfolioUseCase에 대응
 *
 * Repository(domain 타입)에서 데이터를 가져와 → 비즈니스 로직(필터, 환산, 집계)을 수행
 */
export async function fetchPortfolio(
  repo: IExchangeRepository,
): Promise<PortfolioResult> {
  // 비즈니스 규칙: 등록된 거래소가 없으면 빈 결과
  if (repo.getSavedExchanges().length === 0) {
    return EMPTY_RESULT;
  }

  // 1. 환율 + 잔고 병렬 조회
  const [usdtKrw, allAccounts] = await Promise.all([
    repo.fetchUsdtKrwRate(),
    repo.fetchAccounts(),
  ]);

  // 2. 먼지·법정화폐 필터
  const filtered = allAccounts.filter(
    a =>
      !EXCLUDED_CURRENCIES.has(a.currency.toUpperCase()) &&
      a.balance + a.locked > DUST_THRESHOLD,
  );

  // 3. 시세 조회
  const tickerQuery = filtered.map(a => ({exchange: a.exchange, currency: a.currency}));
  const tickers = await repo.fetchTickers(tickerQuery);

  // 4. 시세 맵 구성 (exchange:symbol → TickerPrice)
  const priceMap = new Map<string, TickerPrice>();
  for (const t of tickers) {
    priceMap.set(`${t.exchange}:${t.symbol}`, t);
  }

  // 5. Holding + Detail 변환
  const allHoldings: HoldingData[] = [];
  const allDetails: ExchangeHoldingDetail[] = [];

  for (const acc of filtered) {
    const ticker = priceMap.get(`${acc.exchange}:${acc.currency}`);
    if (!ticker) continue;

    const result = mapAccountToHolding(acc, ticker, usdtKrw);
    allHoldings.push(result.holding);
    allDetails.push(result.detail);
  }

  // 6. 심볼 기준 통합
  const {aggregated, detailMap} = aggregateBySymbol(allHoldings, allDetails);

  // 7. 거래소별 브레이크다운
  const exchangeBreakdown = buildExchangeBreakdown(allHoldings);

  // 8. 전체 합산
  const totalValue = allHoldings.reduce((s, h) => s + h.totalValue, 0);
  const totalChange = allHoldings.reduce((s, h) => s + h.change, 0);
  const denominator = totalValue - totalChange;
  const totalChangeRate =
    denominator > 0 ? (totalChange / denominator) * 100 : 0;

  return {
    holdings: allHoldings,
    aggregated,
    exchangeBreakdown,
    detailMap,
    totalValue,
    totalChange,
    totalChangeRate: isFinite(totalChangeRate) ? totalChangeRate : 0,
  };
}

// ── 내부 헬퍼 ──

function mapAccountToHolding(
  acc: AccountBalance,
  ticker: TickerPrice,
  usdtKrw: number,
) {
  const balance = acc.balance + acc.locked;
  const currencyUnit = EXCHANGE_CURRENCY[acc.exchange];
  const isKrw = currencyUnit === CurrencyUnit.KRW;

  const currentPrice = ticker.currentPrice;
  const valueKrw = isKrw
    ? balance * currentPrice
    : balance * currentPrice * usdtKrw;

  const avgBuy = acc.avgBuyPrice;
  let profitLoss: number | null = null;
  let profitLossPercent: number | null = null;

  if (avgBuy != null && avgBuy > 0) {
    const buyValue = balance * avgBuy;
    const currentVal = isKrw ? valueKrw : balance * currentPrice;
    profitLoss = currentVal - buyValue;
    profitLossPercent = (profitLoss / buyValue) * 100;
  }

  const holding: HoldingData = {
    symbol: acc.currency,
    name: acc.currency,
    balance,
    totalValue: valueKrw,
    change: profitLoss ?? 0,
    changePercent: profitLossPercent ?? ticker.changePercent,
    exchange: acc.exchange,
  };

  const detail: ExchangeHoldingDetail = {
    exchange: acc.exchange,
    symbol: acc.currency,
    quantity: balance,
    avgBuyPrice: avgBuy,
    currentPrice,
    currencyUnit,
    valueKrw,
    profitLoss,
    profitLossPercent,
  };

  return {holding, detail};
}

function aggregateBySymbol(
  allHoldings: HoldingData[],
  allDetails: ExchangeHoldingDetail[],
) {
  const symbolMap = new Map<string, {holdings: HoldingData[]; details: ExchangeHoldingDetail[]}>();

  for (let i = 0; i < allHoldings.length; i++) {
    const key = allHoldings[i].symbol.toUpperCase();
    if (!symbolMap.has(key)) {
      symbolMap.set(key, {holdings: [], details: []});
    }
    symbolMap.get(key)!.holdings.push(allHoldings[i]);
    symbolMap.get(key)!.details.push(allDetails[i]);
  }

  const aggregated: AggregatedHolding[] = [];
  const detailMap: Record<string, ExchangeHoldingDetail[]> = {};

  for (const [sym, {holdings, details}] of symbolMap) {
    const totalBalance = holdings.reduce((s, h) => s + h.balance, 0);
    const totalValue = holdings.reduce((s, h) => s + h.totalValue, 0);
    const totalChange = holdings.reduce((s, h) => s + h.change, 0);
    const denom = totalValue - totalChange;
    const totalChangePercent = denom > 0 ? (totalChange / denom) * 100 : 0;
    const exchanges = [...new Set(holdings.map(h => h.exchange))];

    aggregated.push({
      normalizedSymbol: sym, name: sym,
      totalBalance, totalValue, totalChange,
      totalChangePercent: isFinite(totalChangePercent) ? totalChangePercent : 0,
      holdings, exchanges,
    });

    detailMap[sym] = details;
  }

  aggregated.sort((a, b) => b.totalValue - a.totalValue);
  return {aggregated, detailMap};
}

function buildExchangeBreakdown(allHoldings: HoldingData[]): ExchangeData[] {
  const byExchange = new Map<ExchangeType, number>();
  for (const h of allHoldings) {
    byExchange.set(h.exchange, (byExchange.get(h.exchange) ?? 0) + h.totalValue);
  }

  const breakdown: ExchangeData[] = [];
  for (const [exchange, totalValue] of byExchange) {
    if (totalValue > 0) {
      breakdown.push({exchange, totalValue});
    }
  }
  return breakdown;
}
