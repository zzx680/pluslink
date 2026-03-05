'use client';

import { ButtonHTMLAttributes, forwardRef, useRef, useEffect } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }, ref) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const buttonRef = (ref as any) || internalRef;

    useEffect(() => {
      const btn = buttonRef.current;
      if (!btn) return;

      const handleMouseDown = () => {
        btn.classList.remove('spring-release');
      };

      const handleMouseUp = () => {
        btn.classList.add('spring-release');
        setTimeout(() => btn.classList.remove('spring-release'), 400);
      };

      const handleMouseLeave = () => {
        btn.classList.remove('spring-release');
      };

      btn.addEventListener('mousedown', handleMouseDown);
      btn.addEventListener('mouseup', handleMouseUp);
      btn.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        btn.removeEventListener('mousedown', handleMouseDown);
        btn.removeEventListener('mouseup', handleMouseUp);
        btn.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [buttonRef]);

    const baseStyles = 'btn font-medium rounded-full transition-colors duration-200';

    const variantStyles = {
      primary: 'bg-gray-900 text-white hover:bg-gray-700',
      secondary: 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300',
      ghost: 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    return (
      <button
        ref={buttonRef}
        disabled={disabled || loading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block opacity-60" />
            {children}
          </span>
        ) : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
