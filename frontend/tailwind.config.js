/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#111827',
          800: '#1F2937',
          700: '#374151',
          600: '#4B5563',
          400: '#9CA3AF',
        },
        purple: {
          400: '#C084FC',
          600: '#9333EA',
          700: '#7E22CE',
        },
        pink: {
          600: '#DB2777',
        },
      },
    },
  },
  plugins: [],
}