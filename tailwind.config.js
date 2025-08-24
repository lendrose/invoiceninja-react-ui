const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        inter: ['Inter var', ...defaultTheme.fontFamily.sans],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
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
  ],
};
