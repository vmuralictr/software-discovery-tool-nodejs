/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlue: '#044FC0',
      },
      fontFamily: {
        poppins: ['"Poppins"', 'Helvetica', 'sans-serif'],
        outfit: ['"Outfit"', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

