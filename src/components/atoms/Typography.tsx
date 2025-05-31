import React from 'react';

export interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  className = '',
}) => {
  const baseClasses = 'font-bold text-secondary-900';
  
  const levelClasses = {
    1: 'text-5xl',
    2: 'text-4xl',
    3: 'text-3xl',
    4: 'text-2xl',
    5: 'text-xl',
    6: 'text-lg',
  };
  
  const classes = [baseClasses, levelClasses[level], className].filter(Boolean).join(' ');
  
  // Renderização condicional das tags de heading
  if (level === 1) return <h1 className={classes}>{children}</h1>;
  if (level === 2) return <h2 className={classes}>{children}</h2>;
  if (level === 3) return <h3 className={classes}>{children}</h3>;
  if (level === 4) return <h4 className={classes}>{children}</h4>;
  if (level === 5) return <h5 className={classes}>{children}</h5>;
  return <h6 className={classes}>{children}</h6>;
};

export interface TextProps {
  children: React.ReactNode;
  variant?: 'body' | 'caption' | 'small';
  color?: 'primary' | 'secondary' | 'muted';
  className?: string;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color = 'secondary',
  className = '',
}) => {
  const variantClasses = {
    body: 'text-base',
    caption: 'text-lg',
    small: 'text-sm',
  };
  
  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-900',
    muted: 'text-secondary-600',
  };
  
  const classes = [
    variantClasses[variant],
    colorClasses[color],
    className,
  ].filter(Boolean).join(' ');
  
  return <p className={classes}>{children}</p>;
};
