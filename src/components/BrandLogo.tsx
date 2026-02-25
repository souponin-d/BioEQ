import { type MouseEventHandler } from 'react';

type BrandLogoProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

export const BrandLogo = ({ onClick, className = '' }: BrandLogoProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-lg font-semibold tracking-[0.02em] text-white transition hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${className}`.trim()}
  >
    BioEQ
  </button>
);
