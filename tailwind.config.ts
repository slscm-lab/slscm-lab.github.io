import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean: '#0369a1',
        mint: '#10b981',
        cyan: '#06b6d4',
        amber: '#f59e0b',
      },
      fontFamily: {
        sans: ['Onest', 'sans-serif'],
        editorial: ['Faculty Glyphic', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        soft: '0 10px 30px -18px rgba(15, 23, 42, .22)',
        lift: '0 20px 35px -22px rgba(3, 105, 161, .3)',
      },
    },
  },
  plugins: [],
} satisfies Config;
