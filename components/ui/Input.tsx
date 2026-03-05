import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-900">{label}</label>}
      <input
        className={`w-full px-3 py-2 border border-gray-200 rounded-md focus:border-gray-400 focus:outline-none transition text-gray-900 ${className}`}
        {...props}
      />
    </div>
  );
}
