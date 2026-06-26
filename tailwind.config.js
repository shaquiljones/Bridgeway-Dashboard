/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bridgeway-green': '#1a4d2e',
        'bridgeway-light-green': '#4b7c5a',
        'bridgeway-gold': '#c5a065',
        'bridgeway-dark': '#0f2e1c',
      }
    },
  },
  plugins: [],
}
