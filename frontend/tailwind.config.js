
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      colors: {
        bg: '#e0e5ec',
        text: '#4a5568',
        'neu-green': '#a8d5ba',
        'neu-gray': '#cbd5e0',
        'neu-blue': '#a8c5e0',
        'neu-orange': '#f5c99c',
        'neu-red': '#e0a8a8',
      },
      boxShadow: {
        'neu': '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
        'neu-sm': '5px 5px 10px rgb(163,177,198,0.6), -5px -5px 10px rgba(255,255,255, 0.5)',
        'neu-lg': '12px 12px 20px rgb(163,177,198,0.6), -12px -12px 20px rgba(255,255,255, 0.5)',
        'neu-inset': 'inset 6px 6px 10px 0 rgba(163,177,198, 0.7), inset -6px -6px 10px 0 rgba(255,255,255, 0.8)',
        'neu-inset-sm': 'inset 3px 3px 6px 0 rgba(163,177,198, 0.7), inset -3px -3px 6px 0 rgba(255,255,255, 0.8)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
