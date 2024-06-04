// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff9e6',
          100: '#fff3cc',
          200: '#ffe999',
          300: '#ffdf66',
          400: '#ffd633',
          500: '#ffc300',
          600: '#cc9a00',
          700: '#997300',
          800: '#664d00',
          900: '#332600'
        },
        background: {
          DEFAULT: '#181818'
        }
      },
      keyframes: {
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-in-left': 'slide-in-left 1s ease-in-out',
        'slide-in-left-delay-1': 'slide-in-left 1s ease-in-out 0.5s',
        'slide-in-left-delay-2': 'slide-in-left 1s ease-in-out 1s',
        'slide-in-left-delay-3': 'slide-in-left 1s ease-in-out 1.3s',
        'slide-in-left-delay-4': 'slide-in-left 1s ease-in-out 1.6s',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
      },
    },
  },
  plugins: [],
}
