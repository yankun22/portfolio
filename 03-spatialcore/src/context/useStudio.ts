import { useContext } from 'react';
import { StudioContext, type StudioContextType } from './StudioContextCore';

export const useStudio = (): StudioContextType => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
