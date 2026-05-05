/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        book: {
          paper: '#fdfbf7',
          line: '#e2e8f0',
          margin: '#feb2b2',
          cover: '#2c3e50',
        }
      }
    },
  },
  plugins: [],
}
