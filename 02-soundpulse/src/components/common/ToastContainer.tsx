import React from 'react';
import { Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAudioEngine } from '../../context/useAudioEngine';

export const ToastContainer: React.FC = () => {
  const { toast } = useAudioEngine();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'warning':
        return <AlertTriangle size={16} color="#f59e0b" />;
      case 'info':
        return <Info size={16} color="#06b6d4" />;
      default:
        return <CheckCircle2 size={16} color="#10b981" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#06b6d4';
      default:
        return '#10b981';
    }
  };

  return (
    <div className="sound-toast-container">
      <div className="sound-toast-item" style={{ borderColor: getBorderColor() }}>
        {getIcon()}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
