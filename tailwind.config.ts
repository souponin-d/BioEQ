import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: 'var(--bg)',
        surface1: 'var(--surface-1)',
        surface2: 'var(--surface-2)',
        text: 'var(--text)',
        text2: 'var(--text-2)',
        border: 'var(--border)',
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        neutral: {
          50: '#0B1224',
          100: '#0F1B34',
          200: 'rgba(255,255,255,0.1)',
          700: '#EAF0FF'
        }
      },
      boxShadow: {
        card: '0 20px 48px -24px rgba(0, 0, 0, 0.65)'
      },
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(40px, -30px) scale(1.12)' }
        }
      },
      animation: {
        aurora: 'aurora 12s ease-in-out infinite'
      }
    }
  },
  plugins: []
} satisfies Config;
