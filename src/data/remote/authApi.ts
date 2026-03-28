import {
  generateUpbitAuthToken,
  generateGateSignature,
  sha512Hex,
} from './authHelpers';

const UPBIT_BASE_URL = 'https://api.upbit.com';
const GATE_BASE_URL = 'https://api.gateio.ws';

/**
 * Upbit API Key/Secret 검증
 * GET /v1/accounts 호출 → 성공이면 valid
 */
export async function validateUpbitCredentials(
  apiKey: string,
  secretKey: string,
): Promise<boolean> {
  try {
    const url = `${UPBIT_BASE_URL}/v1/accounts`;
    console.log(`[Auth] Upbit 검증 시작 → ${url}`);
    const token = generateUpbitAuthToken(apiKey, secretKey);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    console.log(`[Auth] Upbit 응답: ${response.status} ${response.statusText}`);
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.log(`[Auth] Upbit 에러 바디: ${body}`);
    }
    return response.ok;
  } catch (e: any) {
    console.error('[Auth] Upbit 검증 예외:', e?.message ?? e);
    return false;
  }
}

/**
 * Gate.io API Key/Secret 검증
 * GET /api/v4/spot/accounts 호출 → 성공이면 valid
 * Android AuthRepositoryImpl.validateGate 포팅
 */
export async function validateGateCredentials(
  apiKey: string,
  secretKey: string,
): Promise<boolean> {
  try {
    const url = `${GATE_BASE_URL}/api/v4/spot/accounts`;
    console.log(`[Auth] Gate.io 검증 시작 → ${url}`);
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const bodyHash = sha512Hex('');
    const signString = `GET\n/api/v4/spot/accounts\n\n${bodyHash}\n${timestamp}`;
    const sign = generateGateSignature(secretKey, signString);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        KEY: apiKey,
        Timestamp: timestamp,
        SIGN: sign,
      },
    });
    console.log(`[Auth] Gate.io 응답: ${response.status} ${response.statusText}`);
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.log(`[Auth] Gate.io 에러 바디: ${body}`);
    }
    return response.ok;
  } catch (e: any) {
    console.error('[Auth] Gate.io 검증 예외:', e?.message ?? e);
    return false;
  }
}
