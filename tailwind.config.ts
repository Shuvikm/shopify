import type {Config} from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        display: ['"Cormorant Garamond"', 'serif'],
      },
      colors: {
        brand: {
          primary: '#121212',
          accent: '#C5A059',
          gold: {
            50: '#FBF8F1',
            100: '#F5EDDD',
            200: '#EBD9B6',
            300: '#E1C28D',
            400: '#D7AC66',
            500: '#C5A059',
            600: '#A6864A',
            700: '#876C3C',
            800: '#68532E',
            900: '#493920',
          },
        },
        paper: '#F9F8F6',
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
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'zoom-in': 'zoomIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slowZoom': 'slowZoom 20s ease-in-out infinite alternate',
      },
      keyframes: {
        skeleton: {
          '0%, 100%': {opacity: '0.4'},
          '50%': {opacity: '1'},
        },
        slideInRight: {
          from: {transform: 'translateX(100%)', opacity: '0'},
          to: {transform: 'translateX(0)', opacity: '1'},
        },
        fadeIn: {
          from: {opacity: '0'},
          to: {opacity: '1'},
        },
        fadeInUp: {
          from: {opacity: '0', transform: 'translateY(20px)'},
          to: {opacity: '1', transform: 'translateY(0)'},
        },
        zoomIn: {
          from: {opacity: '0', transform: 'scale(0.95)'},
          to: {opacity: '1', transform: 'scale(1)'},
        },
        slowZoom: {
          from: {transform: 'scale(1)'},
          to: {transform: 'scale(1.1)'},
        }
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
