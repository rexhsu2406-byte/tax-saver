/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#E8F7F2',
          100: '#C5EAE0',
          200: '#9DD8C8',
          500: '#1D9E75',
          600: '#168962',
          700: '#0F7050',
        },
      },
    },
  },
  plugins: [],
}
