import type {Config} from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dde6ff',
          200: '#c2d1ff',
          300: '#9bb2ff',
          400: '#7089ff',
          500: '#4f63f8',   // primary
          600: '#3a47e8',
          700: '#2e38cc',
          800: '#2830a5',
          900: '#262e82',
          950: '#171a4e',
        },
        neutral: {
          50:  '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#3d3d3d',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '112': '28rem',
        '128': '32rem',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
        },
      },
      animation: {
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        skeleton: {
          '0%, 100%': {opacity: '0.4'},
          '50%': {opacity: '1'},
        },
        slideInRight: {
          from: {transform: 'translateX(100%)'},
          to: {transform: 'translateX(0)'},
        },
        fadeIn: {
          from: {opacity: '0'},
          to: {opacity: '1'},
        },
      },
      boxShadow: {
        card: '0 2px 8px 0 rgb(0 0 0 / 0.08)',
        'card-hover': '0 8px 24px 0 rgb(0 0 0 / 0.14)',
        drawer: '-4px 0 24px 0 rgb(0 0 0 / 0.12)',
      },
    },
  },
  plugins: [typography],
} satisfies Config;
