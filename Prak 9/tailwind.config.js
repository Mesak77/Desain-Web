/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.html"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#007bff', 
        secondary: '#6b7280'
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'] 
      }
    },
  },
  plugins: [],
}