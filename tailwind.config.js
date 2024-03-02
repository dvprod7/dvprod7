/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        electricYellow: '#F5F749',
        softBlue: '#2E86AB',
        mainBlack: '#0D160B',
        softGray: '#DBDBDF',
        alertRed: '#720E07'
      },
      fontFamily: {
        visueltProBld: ["Visuelt ProBold", "sans-serif"],
        visueltPro: ["Visuelt ProRegular", "sans-serif"],
        visueltLg: ["Visuelt ProLight", "sans-serif"],
        Inter: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: [],
}

