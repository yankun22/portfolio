import { useContext } from 'react';
import { AudioEngineContext, type AudioEngineContextType } from './AudioEngineCore';

export const useAudioEngine = (): AudioEngineContextType => {
  const context = useContext(AudioEngineContext);
  if (!context) {
    throw new Error('useAudioEngine must be used within an AudioEngineProvider');
  }
  return context;
};
