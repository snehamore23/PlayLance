/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paylance: {
          dark: '#020617',
          card: '#0F172A',
          border: '#334155',
          green: '#22C55E',
          cyan: '#06B6D4',
          purple: '#8B5CF6',
        }
      }
    },
  },
  plugins: [],
}
