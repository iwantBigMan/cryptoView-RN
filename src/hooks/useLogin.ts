import {useState, useCallback, useEffect} from 'react';
import {ExchangeType, ExchangeDisplayName} from '../domain/Coin';
import {credentialsManager} from '../data/local/credentialsManager';
import {
  validateUpbitCredentials,
  validateGateCredentials,
} from '../data/remote/authApi';

export interface ExchangeInput {
  apiKey: string;
  secretKey: string;
}

export interface LoginState {
  inputs: Record<string, ExchangeInput>;
  selectedExchanges: ExchangeType[];
  savedCredentials: ExchangeType[];
  isLoading: boolean;
  error: string | null;
  loginSuccess: boolean;
}

export function useLogin(onLoginSuccess: () => void) {
  const [state, setState] = useState<LoginState>(() => ({
    inputs: {
      [ExchangeType.UPBIT]: {apiKey: '', secretKey: ''},
      [ExchangeType.GATEIO]: {apiKey: '', secretKey: ''},
    },
    selectedExchanges: [],
    savedCredentials: credentialsManager.getSavedExchanges(),
    isLoading: false,
    error: null,
    loginSuccess: false,
  }));

  const updateApiKey = useCallback(
    (exchange: ExchangeType, apiKey: string) => {
      setState(prev => ({
        ...prev,
        inputs: {
          ...prev.inputs,
          [exchange]: {...(prev.inputs[exchange] ?? {apiKey: '', secretKey: ''}), apiKey},
        },
      }));
    },
    [],
  );

  const updateSecretKey = useCallback(
    (exchange: ExchangeType, secretKey: string) => {
      setState(prev => ({
        ...prev,
        inputs: {
          ...prev.inputs,
          [exchange]: {...(prev.inputs[exchange] ?? {apiKey: '', secretKey: ''}), secretKey},
        },
      }));
    },
    [],
  );

  const toggleExchange = useCallback((exchange: ExchangeType) => {
    setState(prev => {
      const has = prev.selectedExchanges.includes(exchange);
      return {
        ...prev,
        selectedExchanges: has
          ? prev.selectedExchanges.filter(e => e !== exchange)
          : [...prev.selectedExchanges, exchange],
      };
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({...prev, error: null}));
  }, []);

  /**
   * 모든 검증을 먼저 수행한 뒤 → 일괄 저장
   * Android LoginViewModel.saveSelectedCredentials 로직 그대로
   */
  const saveCredentials = useCallback(async () => {
    // Upbit는 필수이므로 항상 포함
    const toSave = new Set([ExchangeType.UPBIT, ...state.selectedExchanges]);

    console.log('[Login] saveCredentials 시작, 대상:', [...toSave]);

    // 1. 입력값 빈칸 검증
    for (const ex of toSave) {
      const input = state.inputs[ex];
      if (!input || !input.apiKey.trim() || !input.secretKey.trim()) {
        console.log(`[Login] ${ExchangeDisplayName[ex]} 입력값 누락`);
        setState(prev => ({
          ...prev,
          error: `${ExchangeDisplayName[ex]}의 API Key/Secret을 입력해주세요`,
        }));
        return;
      }
    }

    console.log('[Login] 입력값 검증 통과, API 검증 시작');
    setState(prev => ({...prev, isLoading: true, error: null}));

    try {
      // 2. 모든 거래소 API 검증 (검증 실패 시 저장하지 않음)
      for (const ex of toSave) {
        const input = state.inputs[ex]!;
        let valid = false;

        switch (ex) {
          case ExchangeType.UPBIT:
            valid = await validateUpbitCredentials(input.apiKey, input.secretKey);
            break;
          case ExchangeType.GATEIO:
            valid = await validateGateCredentials(input.apiKey, input.secretKey);
            break;
          default:
            valid = true;
        }

        if (!valid) {
          console.log(`[Login] ${ExchangeDisplayName[ex]} 검증 실패`);
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: `${ExchangeDisplayName[ex]} 연동 검증 실패. API Key/Secret을 확인하세요.`,
          }));
          return;
        }
        console.log(`[Login] ${ExchangeDisplayName[ex]} 검증 성공`);
      }

      // 3. 모든 검증 성공 후 일괄 저장
      console.log('[Login] 전체 검증 완료, MMKV 일괄 저장 시작');
      credentialsManager.clearAll();
      for (const ex of toSave) {
        const input = state.inputs[ex]!;
        credentialsManager.saveCredentials(ex, input.apiKey, input.secretKey);
      }

      console.log('[Login] MMKV 저장 완료, 저장된 거래소:', credentialsManager.getSavedExchanges());
      setState(prev => ({
        ...prev,
        isLoading: false,
        selectedExchanges: [],
        savedCredentials: credentialsManager.getSavedExchanges(),
        loginSuccess: true,
      }));

      console.log('[Login] 로그인 성공 → onLoginSuccess 호출');
      onLoginSuccess();
    } catch (e: any) {
      console.error('[Login] saveCredentials 예외:', e?.message ?? e);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: `저장 실패: ${e?.message ?? '알 수 없는 오류'}`,
      }));
    }
  }, [state.inputs, state.selectedExchanges, onLoginSuccess]);

  const deleteCredentials = useCallback((exchange: ExchangeType) => {
    credentialsManager.clearCredentials(exchange);
    setState(prev => ({
      ...prev,
      savedCredentials: credentialsManager.getSavedExchanges(),
    }));
  }, []);

  const logout = useCallback(() => {
    credentialsManager.clearAll();
    setState({
      inputs: {
        [ExchangeType.UPBIT]: {apiKey: '', secretKey: ''},
        [ExchangeType.GATEIO]: {apiKey: '', secretKey: ''},
      },
      selectedExchanges: [],
      savedCredentials: [],
      isLoading: false,
      error: null,
      loginSuccess: false,
    });
  }, []);

  return {
    state,
    updateApiKey,
    updateSecretKey,
    toggleExchange,
    saveCredentials,
    deleteCredentials,
    clearError,
    logout,
  };
}
