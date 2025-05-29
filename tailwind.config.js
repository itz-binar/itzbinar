/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        matrix: {
          green: '#00FF41',
          'dark-green': '#003B00',
          'neon': '#39FF14',
          'cyan': '#00FFFF',
          'purple': '#9D00FF',
          'blue': '#0066FF',
        },
      },
      animation: {
        'matrix-fade': 'matrix-fade 2s ease-in-out infinite',
        'glitch': 'glitch 0.3s cubic-bezier(.25,.46,.45,.94)',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
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
        'shimmer': {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
        'gradient-y': {
          '0%, 100%': {
            backgroundSize: '400% 400%',
            backgroundPosition: 'center top'
          },
          '50%': {
            backgroundSize: '200% 200%',
            backgroundPosition: 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            backgroundSize: '200% 200%',
            backgroundPosition: 'left center'
          },
          '50%': {
            backgroundSize: '200% 200%',
            backgroundPosition: 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            backgroundSize: '400% 400%',
            backgroundPosition: 'left top'
          },
          '50%': {
            backgroundSize: '200% 200%',
            backgroundPosition: 'right bottom'
          }
        }
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(to right bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      backgroundSize: {
        'grid-pattern': '20px 20px',
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.matrix.green), 0 0 20px theme(colors.matrix.green)',
        'neon-cyan': '0 0 5px theme(colors.matrix.cyan), 0 0 20px theme(colors.matrix.cyan)',
        'neon-purple': '0 0 5px theme(colors.matrix.purple), 0 0 20px theme(colors.matrix.purple)',
        'inner-glow': 'inset 0 0 20px rgba(0, 255, 65, 0.5)',
      },
      textShadow: {
        'neon': '0 0 5px theme(colors.matrix.green), 0 0 10px theme(colors.matrix.green)',
        'neon-cyan': '0 0 5px theme(colors.matrix.cyan), 0 0 10px theme(colors.matrix.cyan)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-neon': {
          textShadow: '0 0 5px #00FF41, 0 0 10px #00FF41',
        },
        '.text-shadow-neon-cyan': {
          textShadow: '0 0 5px #00FFFF, 0 0 10px #00FFFF',
        },
        '.text-shadow-neon-purple': {
          textShadow: '0 0 5px #9D00FF, 0 0 10px #9D00FF',
        },
        '.backdrop-blur-xs': {
          backdropFilter: 'blur(2px)',
        },
        '.backdrop-blur-2xl': {
          backdropFilter: 'blur(40px)',
        },
        '.backdrop-saturate-150': {
          backdropFilter: 'saturate(150%)',
        },
        '.backdrop-saturate-200': {
          backdropFilter: 'saturate(200%)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};