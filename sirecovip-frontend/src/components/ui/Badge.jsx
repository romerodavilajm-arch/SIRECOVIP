import React from 'react';

const Badge = ({ children, variant = 'default', size = 'md', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full whitespace-nowrap';

  const variants = {
    // Variantes de estatus SIRECOVIP
    'sin-foco': 'bg-gray-100 text-gray-700 border border-gray-300',
    'en-observacion': 'bg-amber-100 text-amber-800 border border-amber-300',
    'prioritario': 'bg-red-100 text-red-800 border border-red-300',
    'en-revision': 'bg-blue-100 text-blue-800 border border-blue-300',
    'aprobado': 'bg-green-100 text-green-800 border border-green-300',
    'rechazado': 'bg-red-100 text-red-800 border border-red-300',

    // Variantes genéricas
    default: 'bg-gray-100 text-gray-700 border border-gray-300',
    primary: 'bg-blue-100 text-blue-700 border border-blue-300',
    success: 'bg-green-100 text-green-700 border border-green-300',
    warning: 'bg-amber-100 text-amber-700 border border-amber-300',
    danger: 'bg-red-100 text-red-700 border border-red-300',
    info: 'bg-blue-100 text-blue-700 border border-blue-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const classes = `${baseStyles} ${variants[variant] || variants.default} ${sizes[size]} ${className}`;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;
