module.exports = {
  purge: [
    './pages/*.tsx',
    './pages/**/*.tsx',
    './components/*.tsx',
    './components/**/*.tsx',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    boxShadow: {
      'small-button': '0px 1px 2px rgba(126, 56, 0, 0.5)',
      button:
        '-6px 8px 10px rgba(81, 41, 10, 0.1), 0px 2px 2px rgba(81, 41, 10, 0.2)',
    },
    extend: {
      animation: {
        enter: 'enter 200ms ease-out',
        'slide-in': 'slide-in 1.2s cubic-bezier(.29,.64,.7,1.14)',
      },
      keyframes: {
        enter: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        'slide-in': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },

      colors: {
        toast: {
          '50': '#FFF6DF',
          '100': '#fdf7f1',
          '200': '#FFE092',
          '300': '#ebbf99',
          '400': '#dea373',
          '500': '#ce864f',
          '600': '#A1724E',
          '700': '#8c501c',
          '800': '#5c340f',
          '900': '#482307',
        },
      },
    },
    container: {
      padding: '1rem',
      center: true,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
