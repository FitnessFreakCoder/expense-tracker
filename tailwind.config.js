/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1fe',
          100: '#cce3fd',
          200: '#99c7fb',
          300: '#66aaf9',
          400: '#338ef7',
          500: '#0072f5',
          600: '#005bc4',
          700: '#004493',
          800: '#002e62',
          900: '#001731',
        },
        success: {
          50: '#e6f7f1',
          100: '#ccefe3',
          200: '#99dfc7',
          300: '#66cfab',
          400: '#33bf8f',
          500: '#10b981',
          600: '#09a370',
          700: '#078f60',
          800: '#056c48',
          900: '#023421',
        },
        warning: {
          50: '#fef5e7',
          100: '#fdebd0',
          200: '#fbd7a1',
          300: '#f9c372',
          400: '#f7af43',
          500: '#f59e0b',
          600: '#c47e09',
          700: '#935e07',
          800: '#623f04',
          900: '#311f02',
        },
        danger: {
          50: '#fdeaec',
          100: '#fbd5d9',
          200: '#f7abb3',
          300: '#f3818d',
          400: '#ef5767',
          500: '#ef4444',
          600: '#c62935',
          700: '#8e1d26',
          800: '#59111a',
          900: '#2d090d',
        },
      },
      boxShadow: {
        card: '0 2px 10px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
  plugins: [],
};