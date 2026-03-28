import {createMMKV} from 'react-native-mmkv';

// 암호화된 MMKV 인스턴스 (API 키 저장 전용)
export const credentialsStorage = createMMKV({
  id: 'exchange-credentials',
  encryptionKey: 'cryptoview-key-v1',
});
