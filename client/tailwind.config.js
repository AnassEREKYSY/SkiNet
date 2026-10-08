/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: { DEFAULT: '#0f2e4f', 900: '#0b2540', 700: '#15375a', 500: '#3b6a96' },
        ice: { 50: '#f1f8fd', 100: '#e3f1fa', 200: '#cbe5f5', 500: '#8cc8ec', 700: '#2f7fb4' },
        snow: '#f7fafc',
        ink: { DEFAULT: '#14212e', muted: '#5d6b7a' },
        line: { DEFAULT: '#e4eaf0', strong: '#cfd8e1' },
        danger: '#b42318',
        success: '#1f7a4d',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
  important: true,
};
