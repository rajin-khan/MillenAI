/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'; // Import default theme

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add Figtree to the font stack
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'gradient-flow': 'gradient-flow 10s ease infinite',
        // Add a new "breathing" animation for glows
        'aurora-glow': 'aurora-glow 10s ease-in-out infinite alternate',
      },
      keyframes: {
        'gradient-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        // Keyframes for the background glow
        'aurora-glow': {
          'from': { 'box-shadow': '0 0 10px -5px #000, 0 0 20px -10px #34d399, -10px 0 30px -15px #06b6d4, 10px 0 40px -20px #6366f1' },
          'to': { 'box-shadow': '0 0 10px -5px #000, 0 0 20px -10px #6366f1, 10px 0 30px -15px #34d399, -10px 0 40px -20px #06b6d4' }
        }
      }
    },
  },
  plugins: [],
}