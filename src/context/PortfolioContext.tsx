import React, {createContext, useContext} from 'react';
import {usePortfolio, PortfolioState} from '../hooks/usePortfolio';

interface PortfolioContextValue {
  state: PortfolioState;
  refresh: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({children}: {children: React.ReactNode}) {
  const {state, refresh} = usePortfolio();
  return (
    <PortfolioContext.Provider value={{state, refresh}}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioContext(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error('usePortfolioContext must be used within PortfolioProvider');
  }
  return ctx;
}
