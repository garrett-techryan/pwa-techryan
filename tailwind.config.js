/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        techryan: {
          yellow: "#fcc931",
          yellowhover: "#f9b616",
          lgray: "4d4d4d",
          dgray: "2e2e2e",
        }
      }
    },
  },
  plugins: [],
}

