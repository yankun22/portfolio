import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const bg =
    toast.type === 'success'
      ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
      : toast.type === 'error'
      ? 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)'
      : 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: bg,
        color: '#ffffff',
        padding: '12px 18px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        zIndex: 10000,
        fontSize: '0.8125rem',
        fontWeight: 600,
        animation: 'slideUp 0.2s ease-out'
      }}
    >
      {toast.type === 'success' && <CheckCircle2 size={18} />}
      {toast.type === 'error' && <AlertCircle size={18} />}
      {toast.type === 'info' && <Info size={18} />}

      <span>{toast.text}</span>

      <button
        onClick={onDismiss}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          padding: 2,
          display: 'flex'
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};
