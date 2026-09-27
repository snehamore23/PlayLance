import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none rounded-xl select-none';

  const variants = {
    primary: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-emerald-400',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600 shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-slate-400',
    outline: 'border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 bg-transparent hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-emerald-400',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-rose-500',
    ghost: 'text-slate-300 hover:text-white hover:bg-slate-800/80 shadow-none focus-visible:ring-slate-400',
  };

  const sizes = {
    xs: 'text-xs px-2.5 py-1 gap-1 font-medium',
    sm: 'text-xs px-3.5 py-2 gap-1.5 font-semibold',
    md: 'text-sm px-4.5 py-2.5 gap-2 font-semibold',
    lg: 'text-base px-6 py-3 gap-2.5 font-bold',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

