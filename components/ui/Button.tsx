import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const base = 'px-4 py-2 rounded-md text-sm font-medium transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-black text-white hover:opacity-90',
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
