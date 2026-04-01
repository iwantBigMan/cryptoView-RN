import {
  generateUpbitAuthToken,
  generateGateSignature,
  sha512Hex,
} from './authHelpers';

const UPBIT_BASE_URL = 'https://api.upbit.com';
const GATE_BASE_URL = 'https://api.gateio.ws';

// ── Upbit 응답 타입 ──

export interface UpbitAccount {
  currency: string;
  balance: string;
  locked: string;
  avg_buy_price: string;
  avg_buy_price_modified: boolean;
  unit_currency: string;
}

export interface UpbitTicker {
  market: string;
  trade_price: number;
  signed_change_price: number;
  signed_change_rate: number;
}

// ── Gate.io 응답 타입 ──

export interface GateAccount {
  currency: string;
  available: string;
  locked: string;
}

export interface GateTicker {
  currency_pair: string;
  last: string;
  change_percentage: string;
}

// ── Upbit API ──

/** Upbit 계좌 잔고 조회 */
export async function fetchUpbitAccounts(
  apiKey: string,
  secretKey: string,
): Promise<UpbitAccount[]> {
  const url = `${UPBIT_BASE_URL}/v1/accounts`;
  const token = generateUpbitAuthToken(apiKey, secretKey);

  const response = await fetch(url, {
    method: 'GET',
    headers: {Authorization: token},
  });

  if (!response.ok) {
    throw new Error(`Upbit accounts API failed: ${response.status}`);
  }

  return response.json();
}

/** Upbit 시세 조회 (KRW 마켓) */
export async function fetchUpbitTickers(
  symbols: string[],
): Promise<UpbitTicker[]> {
  if (symbols.length === 0) {
    return [];
  }

  const markets = symbols.map(s => `KRW-${s}`).join(',');
  const url = `${UPBIT_BASE_URL}/v1/ticker?markets=${encodeURIComponent(markets)}`;

  const response = await fetch(url, {method: 'GET'});

  if (!response.ok) {
    throw new Error(`Upbit ticker API failed: ${response.status}`);
  }

  return response.json();
}

// ── Gate.io API ──

/** Gate.io 스팟 잔고 조회 */
export async function fetchGateAccounts(
  apiKey: string,
  secretKey: string,
): Promise<GateAccount[]> {
  const path = '/api/v4/spot/accounts';
  const url = `${GATE_BASE_URL}${path}`;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const bodyHash = sha512Hex('');
  const signString = `GET\n${path}\n\n${bodyHash}\n${timestamp}`;
  const sign = generateGateSignature(secretKey, signString);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      KEY: apiKey,
      Timestamp: timestamp,
      SIGN: sign,
    },
  });

  if (!response.ok) {
    throw new Error(`Gate.io accounts API failed: ${response.status}`);
  }

  return response.json();
}

/** Gate.io 시세 조회 (USDT 마켓) */
export async function fetchGateTickers(
  symbols: string[],
): Promise<GateTicker[]> {
  if (symbols.length === 0) {
    return [];
  }

  // Gate.io는 개별 쿼리 또는 전체 목록 조회 → 전체 후 필터
  const url = `${GATE_BASE_URL}/api/v4/spot/tickers`;
  const response = await fetch(url, {method: 'GET'});

  if (!response.ok) {
    throw new Error(`Gate.io ticker API failed: ${response.status}`);
  }

  const all: GateTicker[] = await response.json();
  const pairSet = new Set(symbols.map(s => `${s}_USDT`));
  return all.filter(t => pairSet.has(t.currency_pair));
}

/** USDT/KRW 환율 조회 (업비트 KRW-USDT 시세 이용) */
export async function fetchUsdtKrwRate(): Promise<number> {
  try {
    const url = `${UPBIT_BASE_URL}/v1/ticker?markets=KRW-USDT`;
    const response = await fetch(url, {method: 'GET'});
    if (!response.ok) {
      return 1400; // fallback
    }
    const data: UpbitTicker[] = await response.json();
    return data[0]?.trade_price ?? 1400;
  } catch {
    return 1400; // fallback
  }
}
