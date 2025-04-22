import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, fullWidth = false, leftIcon, rightIcon, className = '', ...props }, ref) => {
    const baseInputStyles = 'rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700';
    
    const errorStyles = error
      ? 'border-danger-500 focus:ring-danger-500 dark:border-danger-500 dark:focus:ring-danger-500'
      : 'border-gray-300 dark:border-gray-600';
    
    const paddingStyles = leftIcon
      ? 'pl-10'
      : rightIcon
      ? 'pr-10'
      : 'px-4';
    
    const widthStyle = fullWidth ? 'w-full' : '';
    
    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={props.id} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`py-2 ${paddingStyles} ${baseInputStyles} ${errorStyles} ${widthStyle} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-danger-500 dark:text-danger-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';