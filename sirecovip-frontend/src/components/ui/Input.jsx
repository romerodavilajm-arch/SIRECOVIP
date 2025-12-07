import React from 'react';

const Input = React.forwardRef(({
  label,
  error,
  icon: Icon,
  iconPosition = 'left',
  helperText,
  className = '',
  wrapperClassName = '',
  type = 'text',
  ...props
}, ref) => {
  const hasError = !!error;

  const baseInputStyles = 'w-full px-4 py-2.5 text-body border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed';

  const stateStyles = hasError
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white hover:border-gray-400';

  const iconPaddingStyles = Icon
    ? iconPosition === 'left' ? 'pl-11' : 'pr-11'
    : '';

  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && (
        <label className="block mb-2 text-body-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}

        <input
          ref={ref}
          type={type}
          className={`${baseInputStyles} ${stateStyles} ${iconPaddingStyles} ${className}`}
          aria-invalid={hasError}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
          {...props}
        />

        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
      </div>

      {error && (
        <p id={`${props.id}-error`} className="mt-1.5 text-body-sm text-red-600">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={`${props.id}-helper`} className="mt-1.5 text-body-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
