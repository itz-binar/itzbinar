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
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'matrix-fade': {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 0.4 },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: 0.8,
            transform: 'scale(1)',
          },
          '50%': {
            opacity: 0.4,
            transform: 'scale(1.05)',
          },
        },
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-pattern': '20px 20px',
      },
    },
  },
  plugins: [],
};