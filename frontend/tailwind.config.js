/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui'],
        display: ['Space Grotesk', 'Manrope', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glow: '0 20px 80px rgba(15, 23, 42, 0.18)',
      },
      colors: {
        ink: {
          950: '#07111f',
        },
      },
    },
  },
  plugins: [],
};
