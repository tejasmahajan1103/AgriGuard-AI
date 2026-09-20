import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'white';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 focus-visible:ring-emerald-500',
  secondary:
    'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200 border border-emerald-200 focus-visible:ring-emerald-500',
  outline:
    'border-2 border-slate-300 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 bg-white focus-visible:ring-emerald-500',
  ghost:
    'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 focus-visible:ring-emerald-500',
  danger:
    'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 focus-visible:ring-red-500',
  white:
    'bg-white text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100 border border-emerald-100 shadow-md hover:shadow-lg shadow-black/10 focus-visible:ring-white focus-visible:ring-offset-emerald-600',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3 text-base gap-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
