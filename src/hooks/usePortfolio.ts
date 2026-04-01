import {useState, useCallback, useEffect, useRef} from 'react';
import {fetchPortfolio, EMPTY_RESULT, PortfolioResult} from '../domain/usecase/fetchPortfolio';
import {exchangeRepository} from '../data/repository/exchangeRepository';
import type {IExchangeRepository} from '../domain/repository/IExchangeRepository';

export interface PortfolioState extends PortfolioResult {
  isLoading: boolean;
  error: string | null;
}

const INITIAL: PortfolioState = {
  ...EMPTY_RESULT,
  isLoading: false,
  error: null,
};

/**
 * 포트폴리오 ViewModel
 * UI 상태(loading, error)만 관리하고 비즈니스 로직은 UseCase에 위임
 */
export function usePortfolio(repo: IExchangeRepository = exchangeRepository) {
  const [state, setState] = useState<PortfolioState>(INITIAL);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    setState(prev => ({...prev, isLoading: true, error: null}));

    try {
      const result = await fetchPortfolio(repo);

      if (mountedRef.current) {
        setState({...result, isLoading: false, error: null});
      }
    } catch (e: any) {
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: `데이터 로드 실패: ${e?.message ?? '알 수 없는 오류'}`,
        }));
      }
    }
  }, [repo]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {state, refresh};
}
