import CryptoJS from 'crypto-js';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function base64url(wordArray: CryptoJS.lib.WordArray): string {
  return wordArray
    .toString(CryptoJS.enc.Base64)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function stringToBase64url(str: string): string {
  const wordArray = CryptoJS.enc.Utf8.parse(str);
  return base64url(wordArray);
}

/**
 * 업비트 JWT 토큰 생성 (HMAC-SHA256)
 * Android UpbitAuthHelper.generateAuthToken 포팅
 */
export function generateUpbitAuthToken(
  accessKey: string,
  secretKey: string,
  queryOrBody?: string,
): string {
  const header = stringToBase64url(JSON.stringify({alg: 'HS256', typ: 'JWT'}));

  const payload: Record<string, string> = {
    access_key: accessKey,
    nonce: generateUUID(),
  };

  if (queryOrBody && queryOrBody.length > 0) {
    payload.query_hash = CryptoJS.SHA512(queryOrBody).toString(CryptoJS.enc.Hex);
    payload.query_hash_alg = 'SHA512';
  }

  const payloadEncoded = stringToBase64url(JSON.stringify(payload));
  const signature = CryptoJS.HmacSHA256(
    `${header}.${payloadEncoded}`,
    secretKey,
  );
  const signatureEncoded = base64url(signature);

  return `Bearer ${header}.${payloadEncoded}.${signatureEncoded}`;
}

/**
 * Gate.io HMAC-SHA512 서명 생성
 * Android GateIOAuthHelper.generateSignature 포팅
 */
export function generateGateSignature(
  secretKey: string,
  message: string,
): string {
  return CryptoJS.HmacSHA512(message, secretKey).toString(CryptoJS.enc.Hex);
}

/** SHA-512 hex digest */
export function sha512Hex(input: string): string {
  return CryptoJS.SHA512(input).toString(CryptoJS.enc.Hex);
}
