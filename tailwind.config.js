/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#FAF9FC',
          100: '#F0EFF6',
          200: '#E7E5F0',
          300: '#B5B8D1',
          400: '#8B8FA8',
          500: '#62678F',
          600: '#454A73',
          700: '#2E335E',
          800: '#1F2352',
          900: '#171A45',
          950: '#0E102E',
        },
        accent: {
          pink: '#F51F7D',
          magenta: '#B817A8',
          purple: '#7610C3',
          'deep-purple': '#4B12A8',
          violet: '#7610C3',
          indigo: '#3825B8',
          'royal-blue': '#4564E8',
          blue: '#4893E5',
          cyan: '#48BDD9',
        },
        purpleAtmosphere: {
          lavender: '#F1E8FF',
          soft: '#D8B4FE',
          electric: '#A855F7',
          royal: '#7C3AED',
          deep: '#3B176F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        hero: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'gradient-drift': 'gradientDrift 20s ease-in-out infinite',
        'gradient-drift-slow': 'gradientDrift 25s ease-in-out infinite',
        'float-particle': 'floatParticle 8s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'shimmer': 'shimmer 1.8s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        gradientDrift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(5%, -3%) scale(1.05)' },
          '66%': { transform: 'translate(-3%, 5%) scale(0.98)' },
        },
        floatParticle: {
          '0%, 100%': { opacity: '0.2', transform: 'translateY(0)' },
          '50%': { opacity: '0.6', transform: 'translateY(-20px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
