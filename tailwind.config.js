/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        clan: {
          bg: '#080a0f',
          surface: '#0f141f',
          card: '#141b29',
          border: '#232d42',
          orange: '#ff6700',
          red: '#ff1e3c',
          gold: '#f59e0b',
          glow: 'rgba(255, 103, 0, 0.35)',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'flame-pulse': 'flameGlow 3s ease-in-out infinite',
        'float': 'floatSlow 4s ease-in-out infinite',
      },
      keyframes: {
        flameGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 15px rgba(255, 103, 0, 0.6))' },
          '50%': { filter: 'drop-shadow(0 0 28px rgba(255, 30, 60, 0.85))' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
