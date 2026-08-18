import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  subtle?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', subtle = false, style }) => {
  return (
    <div className={`glass-card ${subtle ? 'subtle' : ''} ${className}`} style={style}>
      {children}
    </div>
  );
};
