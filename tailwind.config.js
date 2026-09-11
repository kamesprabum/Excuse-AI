/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f4f5fb',
          100: '#e8eaf6',
          200: '#c5c9e8',
          300: '#9aa1d4',
          400: '#6b73c0',
          500: '#4a51a8',
          600: '#363c8a',
          700: '#282d6e',
          800: '#1b1f52',
          900: '#121538',
          950: '#0a0c24',
        },
        accent: {
          pink: '#ec4899',
          magenta: '#d946ef',
          violet: '#8b5cf6',
          indigo: '#6366f1',
          blue: '#3b82f6',
          cyan: '#06b6d4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'gradient-drift': 'gradientDrift 20s ease-in-out infinite',
        'gradient-drift-slow': 'gradientDrift 25s ease-in-out infinite',
        'float-particle': 'floatParticle 8s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'mascot-blink': 'mascotBlink 4s ease-in-out infinite',
        'mascot-wink': 'mascotWink 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 1.8s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        gradientDrift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(3%, -2%) scale(1.05)' },
          '66%': { transform: 'translate(-2%, 3%) scale(0.98)' },
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
        mascotBlink: {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '94%, 96%': { transform: 'scaleY(0.1)' },
        },
        mascotWink: {
          '0%, 80%, 100%': { transform: 'scaleY(1)' },
          '85%, 92%': { transform: 'scaleY(0.1)' },
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
