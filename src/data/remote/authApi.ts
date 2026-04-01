import {fetchUpbitAccounts, fetchGateAccounts} from './exchangeApi';

/**
 * Upbit API Key/Secret 검증
 * fetchUpbitAccounts 호출 → 성공이면 valid
 */
export async function validateUpbitCredentials(
  apiKey: string,
  secretKey: string,
): Promise<boolean> {
  try {
    console.log('[Auth] Upbit 검증 시작');
    await fetchUpbitAccounts(apiKey, secretKey);
    console.log('[Auth] Upbit 검증 성공');
    return true;
  } catch (e: any) {
    console.error('[Auth] Upbit 검증 실패:', e?.message ?? e);
    return false;
  }
}

/**
 * Gate.io API Key/Secret 검증
 * fetchGateAccounts 호출 → 성공이면 valid
 */
export async function validateGateCredentials(
  apiKey: string,
  secretKey: string,
): Promise<boolean> {
  try {
    console.log('[Auth] Gate.io 검증 시작');
    await fetchGateAccounts(apiKey, secretKey);
    console.log('[Auth] Gate.io 검증 성공');
    return true;
  } catch (e: any) {
    console.error('[Auth] Gate.io 검증 실패:', e?.message ?? e);
    return false;
  }
}
