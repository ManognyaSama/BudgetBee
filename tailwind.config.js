/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bee: {
          50: '#fffbeb',
          100: '#fef3c7', 
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        honey: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a', 
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
        },
      },
    },
  },
  plugins: [],
}
