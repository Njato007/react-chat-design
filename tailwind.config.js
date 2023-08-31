/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        // sm: '.845rem',
        xs: '.8rem',
        xxs: '.75rem',
        xxxs: '.65rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    }),
    require('tailwind-scrollbar-hide')
  ],
}