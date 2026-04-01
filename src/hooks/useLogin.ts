import {useState, useCallback} from 'react';
import {ExchangeType} from '../domain/model/Exchange';
import {exchangeRepository} from '../data/repository/exchangeRepository';
import type {IExchangeRepository} from '../domain/repository/IExchangeRepository';
import {
  saveCredentials as saveCredentialsUseCase,
  deleteCredential,
  logout as logoutUseCase,
  ValidationError,
} from '../domain/usecase/saveCredentials';

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

export function useLogin(
  onLoginSuccess: () => void,
  repo: IExchangeRepository = exchangeRepository,
) {
  const [state, setState] = useState<LoginState>(() => ({
    inputs: {
      [ExchangeType.UPBIT]: {apiKey: '', secretKey: ''},
      [ExchangeType.GATEIO]: {apiKey: '', secretKey: ''},
    },
    selectedExchanges: [],
    savedCredentials: repo.getSavedExchanges(),
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

  const saveCredentials = useCallback(async () => {
    setState(prev => ({...prev, isLoading: true, error: null}));

    try {
      await saveCredentialsUseCase(repo, state.inputs, state.selectedExchanges);

      setState(prev => ({
        ...prev,
        isLoading: false,
        selectedExchanges: [],
        savedCredentials: repo.getSavedExchanges(),
        loginSuccess: true,
      }));

      onLoginSuccess();
    } catch (e: any) {
      const message = e instanceof ValidationError
        ? e.message
        : `저장 실패: ${e?.message ?? '알 수 없는 오류'}`;
      setState(prev => ({...prev, isLoading: false, error: message}));
    }
  }, [state.inputs, state.selectedExchanges, onLoginSuccess]);

  const deleteCredentials = useCallback((exchange: ExchangeType) => {
    deleteCredential(repo, exchange);
    setState(prev => ({
      ...prev,
      savedCredentials: repo.getSavedExchanges(),
    }));
  }, [repo]);

  const logout = useCallback(() => {
    logoutUseCase(repo);
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
  }, [repo]);

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
