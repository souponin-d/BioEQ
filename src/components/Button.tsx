import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const baseClassName =
  'inline-flex items-center justify-center border border-primary bg-primary px-6 py-3 text-sm font-medium text-white transition duration-200 hover:border-accent hover:bg-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2';

export const Button = ({ children, className = '', type = 'button', ...rest }: Props) => (
  <button type={type} className={`${baseClassName} ${className}`.trim()} {...rest}>
    {children}
  </button>
);
