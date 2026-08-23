import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'warm';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-gradient-to-b from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-soft hover:shadow-glow active:scale-[0.98]',
  secondary: 'bg-gradient-to-b from-ink-800 to-ink-900 text-white hover:from-ink-900 hover:to-ink-950 shadow-soft active:scale-[0.98]',
  accent: 'bg-gradient-to-b from-accent-400 to-accent-500 text-white hover:from-accent-500 hover:to-accent-600 shadow-soft hover:shadow-glow-accent active:scale-[0.98]',
  outline: 'border border-ink-200 text-ink-700 hover:bg-ink-50 hover:border-ink-300 bg-white hover:shadow-soft active:scale-[0.98]',
  ghost: 'text-ink-600 hover:bg-ink-100 hover:text-ink-900 active:scale-[0.98]',
  danger: 'bg-gradient-to-b from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 shadow-soft active:scale-[0.98]',
  warm: 'bg-gradient-to-b from-warm-400 to-warm-500 text-white hover:from-warm-500 hover:to-warm-600 shadow-soft active:scale-[0.98]',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-base gap-2.5',
  icon: 'h-10 w-10',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, leftIcon, rightIcon, className = '', children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
);
Button.displayName = 'Button';

interface LinkButtonProps {
  to: string;
  variant?: Variant;
  size?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function LinkButton({ to, variant = 'primary', size = 'md', leftIcon, rightIcon, className = '', children }: LinkButtonProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </Link>
  );
}
