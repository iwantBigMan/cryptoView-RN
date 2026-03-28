import {ExchangeType} from '../../domain/Coin';
import {credentialsStorage} from './mmkvStorage';

const KEYS = {
  [ExchangeType.UPBIT]: {
    apiKey: 'upbit_api_key',
    secretKey: 'upbit_secret_key',
  },
  [ExchangeType.GATEIO]: {
    apiKey: 'gateio_api_key',
    secretKey: 'gateio_secret_key',
  },
} as const;

export interface ExchangeCredentials {
  upbitApiKey: string;
  upbitSecretKey: string;
  gateioApiKey: string;
  gateioSecretKey: string;
}

function emptyCredentials(): ExchangeCredentials {
  return {
    upbitApiKey: '',
    upbitSecretKey: '',
    gateioApiKey: '',
    gateioSecretKey: '',
  };
}

export const credentialsManager = {
  /** 저장된 인증 정보 조회 */
  getCredentials(): ExchangeCredentials {
    return {
      upbitApiKey: credentialsStorage.getString(KEYS[ExchangeType.UPBIT].apiKey) ?? '',
      upbitSecretKey: credentialsStorage.getString(KEYS[ExchangeType.UPBIT].secretKey) ?? '',
      gateioApiKey: credentialsStorage.getString(KEYS[ExchangeType.GATEIO].apiKey) ?? '',
      gateioSecretKey: credentialsStorage.getString(KEYS[ExchangeType.GATEIO].secretKey) ?? '',
    };
  },

  /** 거래소별 인증 정보 저장 */
  saveCredentials(exchange: ExchangeType, apiKey: string, secretKey: string) {
    const keys = KEYS[exchange];
    if (!keys) {
      return;
    }
    credentialsStorage.set(keys.apiKey, apiKey);
    credentialsStorage.set(keys.secretKey, secretKey);
  },

  /** 거래소별 인증 정보 삭제 */
  clearCredentials(exchange: ExchangeType) {
    const keys = KEYS[exchange];
    if (!keys) {
      return;
    }
    credentialsStorage.remove(keys.apiKey);
    credentialsStorage.remove(keys.secretKey);
  },

  /** 모든 인증 정보 삭제 (로그아웃) */
  clearAll() {
    credentialsStorage.clearAll();
  },

  /** 필수 인증(Upbit) 존재 여부 */
  hasRequiredCredentials(): boolean {
    const creds = this.getCredentials();
    return creds.upbitApiKey.length > 0 && creds.upbitSecretKey.length > 0;
  },

  /** 저장된 거래소 목록 */
  getSavedExchanges(): ExchangeType[] {
    const creds = this.getCredentials();
    const saved: ExchangeType[] = [];
    if (creds.upbitApiKey && creds.upbitSecretKey) {
      saved.push(ExchangeType.UPBIT);
    }
    if (creds.gateioApiKey && creds.gateioSecretKey) {
      saved.push(ExchangeType.GATEIO);
    }
    return saved;
  },
};
