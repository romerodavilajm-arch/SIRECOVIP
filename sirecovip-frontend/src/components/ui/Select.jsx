import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Seleccionar...',
  className = '',
  wrapperClassName = '',
  ...props
}, ref) => {
  const hasError = !!error;

  const baseSelectStyles = 'w-full px-4 py-2.5 text-body border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white pr-10';

  const stateStyles = hasError
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-400';

  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && (
        <label className="block mb-2 text-body-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          className={`${baseSelectStyles} ${stateStyles} ${className}`}
          aria-invalid={hasError}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <ChevronDown size={20} />
        </div>
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

Select.displayName = 'Select';

export default Select;
