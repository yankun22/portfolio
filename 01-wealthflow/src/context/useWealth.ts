import { useContext } from 'react';
import { WealthContext, type WealthContextType } from './WealthContextCore';

export const useWealth = (): WealthContextType => {
  const context = useContext(WealthContext);
  if (!context) {
    throw new Error('useWealth must be used within a WealthProvider');
  }
  return context;
};
