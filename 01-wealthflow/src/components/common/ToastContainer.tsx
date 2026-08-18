import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useWealth } from '../../context/useWealth';

export const ToastContainer: React.FC = () => {
  const { toast } = useWealth();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'info':
        return <Info size={18} color="#06b6d4" />;
      case 'warning':
        return <AlertTriangle size={18} color="#f59e0b" />;
      default:
        return <CheckCircle2 size={18} color="#10b981" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'info':
        return 'rgba(6, 182, 212, 0.4)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.4)';
      default:
        return 'rgba(16, 185, 129, 0.4)';
    }
  };

  return (
    <div className="toast-container">
      <div className="toast-item" style={{ borderColor: getBorderColor() }}>
        {getIcon()}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
