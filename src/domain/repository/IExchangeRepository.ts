import {ExchangeType} from '../model/Exchange';
import type {AccountBalance, TickerPrice} from '../model/Account';

/**
 * 거래소 Repository 인터페이스
 * Android의 domain 모듈 ExchangeRepository interface에 대응
 *
 * domain 레이어 타입만 사용하여 data layer와 완전 분리.
 * UseCase는 이 인터페이스에만 의존하고,
 * 실제 구현체(data layer)는 hook(ViewModel)에서 주입한다.
 */
export interface IExchangeRepository {
  // ── 데이터 조회 ──
  fetchAccounts(): Promise<AccountBalance[]>;
  fetchTickers(symbols: Array<{exchange: ExchangeType; currency: string}>): Promise<TickerPrice[]>;
  fetchUsdtKrwRate(): Promise<number>;

  // ── 크리덴셜 관리 ──
  validateCredentials(exchange: ExchangeType, apiKey: string, secretKey: string): Promise<boolean>;
  replaceAllCredentials(entries: Array<{exchange: ExchangeType; apiKey: string; secretKey: string}>): void;
  deleteCredentials(exchange: ExchangeType): void;
  clearAll(): void;
  getSavedExchanges(): ExchangeType[];
  hasRequiredCredentials(): boolean;
}
