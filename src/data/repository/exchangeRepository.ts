import {ExchangeType} from '../../domain/model/Exchange';
import type {IExchangeRepository} from '../../domain/repository/IExchangeRepository';
import type {AccountBalance, TickerPrice} from '../../domain/model/Account';
import {credentialsManager} from '../local/credentialsManager';
import {
  fetchUpbitAccounts,
  fetchUpbitTickers,
  fetchGateAccounts,
  fetchGateTickers,
  fetchUsdtKrwRate,
} from '../remote/exchangeApi';

/**
 * IExchangeRepository 구현체
 * Android의 ExchangeRepositoryImpl에 대응
 * API 응답 → domain 모델 매핑을 담당
 */
export const exchangeRepository: IExchangeRepository = {
  /** 저장된 거래소의 잔고를 조회하고 domain 모델로 매핑 */
  async fetchAccounts(): Promise<AccountBalance[]> {
    const savedExchanges = credentialsManager.getSavedExchanges();
    const creds = credentialsManager.getCredentials();
    const results: AccountBalance[] = [];

    if (savedExchanges.includes(ExchangeType.UPBIT)) {
      const accounts = await fetchUpbitAccounts(creds.upbitApiKey, creds.upbitSecretKey);
      for (const a of accounts) {
        results.push({
          exchange: ExchangeType.UPBIT,
          currency: a.currency,
          balance: parseFloat(a.balance),
          locked: parseFloat(a.locked),
          avgBuyPrice: parseFloat(a.avg_buy_price) || null,
        });
      }
    }

    if (savedExchanges.includes(ExchangeType.GATEIO)) {
      const accounts = await fetchGateAccounts(creds.gateioApiKey, creds.gateioSecretKey);
      for (const a of accounts) {
        results.push({
          exchange: ExchangeType.GATEIO,
          currency: a.currency.toUpperCase(),
          balance: parseFloat(a.available),
          locked: parseFloat(a.locked),
          avgBuyPrice: null,
        });
      }
    }

    return results;
  },

  /** 심볼 목록에 대한 시세를 조회하고 domain 모델로 매핑 */
  async fetchTickers(
    symbols: Array<{exchange: ExchangeType; currency: string}>,
  ): Promise<TickerPrice[]> {
    const upbitSymbols = symbols
      .filter(s => s.exchange === ExchangeType.UPBIT)
      .map(s => s.currency);
    const gateSymbols = symbols
      .filter(s => s.exchange === ExchangeType.GATEIO)
      .map(s => s.currency);

    const [upbitTickers, gateTickers] = await Promise.all([
      upbitSymbols.length > 0 ? fetchUpbitTickers(upbitSymbols) : Promise.resolve([]),
      gateSymbols.length > 0 ? fetchGateTickers(gateSymbols) : Promise.resolve([]),
    ]);

    const results: TickerPrice[] = [];

    for (const t of upbitTickers) {
      results.push({
        exchange: ExchangeType.UPBIT,
        symbol: t.market.replace('KRW-', ''),
        currentPrice: t.trade_price,
        changePercent: t.signed_change_rate * 100,
      });
    }

    for (const t of gateTickers) {
      results.push({
        exchange: ExchangeType.GATEIO,
        symbol: t.currency_pair.replace('_USDT', ''),
        currentPrice: parseFloat(t.last),
        changePercent: parseFloat(t.change_percentage),
      });
    }

    return results;
  },

  /** USDT/KRW 환율 조회 */
  fetchUsdtKrwRate,

  /** 크리덴셜 검증 (accounts API 호출로 검증) */
  async validateCredentials(
    exchange: ExchangeType,
    apiKey: string,
    secretKey: string,
  ): Promise<boolean> {
    try {
      switch (exchange) {
        case ExchangeType.UPBIT:
          await fetchUpbitAccounts(apiKey, secretKey);
          return true;
        case ExchangeType.GATEIO:
          await fetchGateAccounts(apiKey, secretKey);
          return true;
        default:
          return true;
      }
    } catch {
      return false;
    }
  },

  /** 모든 크리덴셜 삭제 후 일괄 저장 */
  replaceAllCredentials(
    entries: Array<{exchange: ExchangeType; apiKey: string; secretKey: string}>,
  ) {
    credentialsManager.clearAll();
    for (const e of entries) {
      credentialsManager.saveCredentials(e.exchange, e.apiKey, e.secretKey);
    }
  },

  /** 개별 거래소 크리덴셜 삭제 */
  deleteCredentials(exchange: ExchangeType) {
    credentialsManager.clearCredentials(exchange);
  },

  /** 모든 크리덴셜 삭제 (로그아웃) */
  clearAll() {
    credentialsManager.clearAll();
  },

  /** 저장된 거래소 목록 */
  getSavedExchanges(): ExchangeType[] {
    return credentialsManager.getSavedExchanges();
  },

  /** 필수 인증 존재 여부 */
  hasRequiredCredentials(): boolean {
    return credentialsManager.hasRequiredCredentials();
  },
};
