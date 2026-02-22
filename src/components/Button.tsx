import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const baseClassName =
  'inline-flex items-center justify-center border border-primary bg-transparent px-6 py-3 text-sm font-medium text-primary transition duration-200 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2';

export const Button = ({ children, className = '', type = 'button', ...rest }: Props) => (
  <button type={type} className={`${baseClassName} ${className}`.trim()} {...rest}>
    {children}
  </button>
);
