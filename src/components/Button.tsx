import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'ghost';

type Props = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const baseClassName =
  'inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(34,211,238,0.35)] focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none';

const variants: Record<Variant, string> = {
  primary:
    'border-primary bg-primary text-text hover:border-primary-hover hover:bg-primary-hover hover:text-text shadow-[0_10px_30px_-18px_rgba(79,124,255,0.8)]',
  outline: 'border-primary/60 bg-transparent text-primary hover:bg-primary/15 hover:text-text hover:border-primary',
  ghost: 'border-transparent bg-transparent text-text2 hover:bg-surface2 hover:text-text'
};

export const Button = ({ children, className = '', type = 'button', variant = 'primary', ...rest }: Props) => (
  <button type={type} className={`${baseClassName} ${variants[variant]} ${className}`.trim()} {...rest}>
    {children}
  </button>
);
