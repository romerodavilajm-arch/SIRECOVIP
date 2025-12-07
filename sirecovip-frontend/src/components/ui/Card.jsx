import React from 'react';

const Card = ({ children, className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white border border-gray-200 shadow-md',
    outlined: 'bg-white border-2 border-gray-300',
  };

  return (
    <div
      className={`rounded-lg overflow-hidden ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`px-6 py-4 border-b border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = '', as: Component = 'h3', ...props }) => {
  return (
    <Component
      className={`text-h4 font-semibold text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p
      className={`text-body-sm text-gray-600 mt-1 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`px-6 py-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
