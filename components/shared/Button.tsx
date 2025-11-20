
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`bg-cyan-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-cyan-500 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-[1.03] active:scale-[0.99] shadow-md hover:shadow-cyan-500/20 disabled:shadow-none disabled:scale-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};