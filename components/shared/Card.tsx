
import React from 'react';

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, icon, children, className = '', headerActions }) => {
  return (
    <div className={`bg-gray-900/50 backdrop-blur-md border border-cyan-400/20 rounded-xl shadow-lg shadow-black/30 ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-cyan-400/20">
        <div className="flex items-center">
            {icon && <div className="mr-3 text-cyan-400">{icon}</div>}
            <h2 className="text-lg font-semibold text-white tracking-wider">{title}</h2>
        </div>
        {headerActions && <div>{headerActions}</div>}
      </div>
      <div className="text-gray-300">
        {children}
      </div>
    </div>
  );
};