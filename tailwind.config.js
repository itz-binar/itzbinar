/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        matrix: {
          green: '#00FF41',
          'dark-green': '#003B00',
        },
      },
      animation: {
        'matrix-fade': 'matrix-fade 2s ease-in-out infinite',
        'glitch': 'glitch 0.3s cubic-bezier(.25,.46,.45,.94)',
      },
      keyframes: {
        'matrix-fade': {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 0.4 },
        },
      },
    },
  },
  plugins: [],
};