module.exports = {
  mode: 'jit',
  content: [
    './pages/*.tsx',
    './pages/**/*.tsx',
    './pages/*.mdx',
    './pages/**/*.mdx',
    './components/*.tsx',
    './components/**/*.tsx',
  ],
  theme: {
    extend: {
      boxShadow: {
        'small-button': '0px 1px 2px rgba(126, 56, 0, 0.5)',
        button:
          '-6px 8px 10px rgba(81, 41, 10, 0.1), 0px 2px 2px rgba(81, 41, 10, 0.2)',
        'button-active':
          '-1px 2px 5px rgba(81, 41, 10, 0.15), 0px 1px 1px rgba(81, 41, 10, 0.15)',
      },
      animation: {
        enter: 'enter 200ms ease-out',
        'slide-in': 'slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)',
        leave: 'leave 150ms ease-in forwards',
      },
      keyframes: {
        enter: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        leave: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(0.9)', opacity: 0 },
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
          '200': '#F8EEDB',
          '300': '#ebbf99',
          '400': '#dea373',
          '500': '#ce864f',
          '600': '#A1724E',
          '700': '#8c501c',
          '800': '#5c340f',
          '900': '#482307',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-bullets': theme('colors.toast[400]'),
            '--tw-prose-links': theme('colors.toast[600]'),
            color: theme('colors.toast.900'),
            h1: {
              color: theme('colors.toast.900'),
            },
            h2: {
              color: theme('colors.toast.900'),
            },
            h3: {
              color: theme('colors.toast.800'),
            },
            h4: {
              color: theme('colors.toast.900'),
            },
            a: {
              color: theme('colors.toast.600'),
            },
            strong: {
              color: theme('colors.toast.900'),
            },
            pre: {
              color: null,
              backgroundColor: null,
              overflowX: 'auto',
              fontSize: theme('fontSize.base'),
              padding: 0,
            },
            'pre pre': {
              padding: theme('spacing.4'),
              margin: 0,
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              fontWeight: '400',
              color: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit',
            },
            code: {
              color: theme('colors.toast.900'),
              fontWeight: '600',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            thead: {
              color: theme('colors.toast.900'),
              fontWeight: '600',
              borderBottomWidth: '1px',
              borderBottomColor: theme('colors.toast.200'),
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: theme('colors.toast.200'),
            },
            'ul > li::before': {
              content: '""',
              position: 'absolute',
              backgroundColor: theme('colors.toast.800'),
              borderRadius: '50%',
            },
            // ...
          },
        },
      }),
    },
    container: {
      padding: '1rem',
      center: true,
    },
  },
  variants: {
    extend: {
      translate: ['active'],
      gradientColorStops: ['active'],
      boxShadow: ['active'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
