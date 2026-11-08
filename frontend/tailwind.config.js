/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#2d6a4f',
          600: '#1b4332',
          700: '#143628',
          800: '#0f291e',
          900: '#081c14',
          DEFAULT: '#1b4332',
        },
        cream: {
          50: '#fdfbf7',
          100: '#f7f4ee',
          200: '#ede8dc',
          300: '#ded5c4',
          DEFAULT: '#fdfbf7',
        },
        earth: {
          50: '#fbf8f5',
          100: '#f5ede4',
          200: '#ebd9c6',
          300: '#ddb892',
          400: '#b08968',
          500: '#936639',
          600: '#7f4f24',
          DEFAULT: '#7f4f24',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
