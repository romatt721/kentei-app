/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#16A34A',
        // secondaryのテキスト表示用（白・淡色背景でWCAG AA 4.5:1のコントラスト比を満たす濃い緑）。
        // secondary自体は白文字ボタンの背景色として現状十分なコントラストがあるため据え置き、
        // secondaryを文字色として使う箇所（バッジ・ラベル）にのみこちらを使う。
        secondaryText: '#15803D',
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
