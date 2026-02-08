/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    { pattern: /^(bg|text|border|ring|from|to|focus:ring)-primary-\d+/ },
    { pattern: /^hover:bg-primary-\d+/ },
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef5f3',
          100: '#fde8e4',
          200: '#fbd1c9',
          300: '#f7b2a3',
          400: '#f38b72',
          500: '#ef6647',
          600: '#f74f25', // Main CTA – always use for primary buttons
          700: '#dc3d1a',
          800: '#b83318',
          900: '#932e19',
        },
        tiktok: {
          black: '#0f0f0f',
          pink: '#fe2c55',
          blue: '#25f4ee',
        },
      },
    },
  },
  plugins: [],
}
