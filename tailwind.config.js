const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Montserrat', 'system-ui', 'sans-serif'],
        'heading': ['integral-cf', 'system-ui', 'sans-serif'],
        inter: ['Inter var', ...defaultTheme.fontFamily.sans],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        // Dark mode colors from SVG
        dark: {
          bg: '#241F21', // Main dark background from SVG
          surface: '#2A2527', // Slightly lighter for cards/surfaces
          border: '#3A3537', // Subtle borders
        },
        primary: {
          50: '#e6f0ff',
          100: '#cce1ff',
          200: '#99c3ff',
          300: '#66a5ff',
          400: '#3387ff',
          500: '#116DF4', // Blue from SVG
          600: '#0e5ad1',
          700: '#0b47ae',
          800: '#08348b',
          900: '#052168',
        },
        secondary: {
          50: '#e6fdf4',
          100: '#ccfbe9',
          200: '#99f7d3',
          300: '#66f3bd',
          400: '#33efa7',
          500: '#3EDB93', // Green from SVG
          600: '#32af76',
          700: '#268359',
          800: '#19573c',
          900: '#0d2b1f',
        },
        // Theme-aware UI colors
        ui: {
          background: 'var(--ui-background)',
          foreground: 'var(--ui-foreground)',
          muted: 'var(--ui-muted)',
          'muted-foreground': 'var(--ui-muted-foreground)',
          border: 'var(--ui-border)',
          input: 'var(--ui-input)',
          ring: 'var(--ui-ring)',
          card: 'var(--ui-card)',
          'card-foreground': 'var(--ui-card-foreground)',
        },
        ninja: {
          gray: '#242930',
          'gray-darker': '#2F2E2E',
          'gray-lighter': '#363D47',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
};
