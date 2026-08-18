import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useStudio } from '../../context/useStudio';

export const ToastContainer: React.FC = () => {
  const { toast } = useStudio();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'warning':
        return <AlertTriangle size={16} color="#f59e0b" />;
      case 'info':
        return <Info size={16} color="#00f0ff" />;
      default:
        return <CheckCircle2 size={16} color="#10b981" />;
    }
  };

  return (
    <div className="spatial-toast-wrap">
      <div className="spatial-toast">
        {getIcon()}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
