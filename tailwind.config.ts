import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#ffffff',
        primary: '#06394f',
        accent: '#00bcd4',
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          700: '#334155'
        }
      },
      boxShadow: {
        card: '0 24px 50px -20px rgba(6, 57, 79, 0.2)'
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
