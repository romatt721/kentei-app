/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#16A34A',
        accent: '#DC2626',
        surface: '#F8FAFC',
        card: '#FFFFFF',
        textMain: '#1E293B',
        textSub: '#64748B',
        border: '#E2E8F0',
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
