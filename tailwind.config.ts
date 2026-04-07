import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#78bf49',
          dark:    '#5a9935',
          light:   '#96d166',
          pale:    '#f0f9e8',
          mid:     '#d4efbb',
        },
        cream: '#FDFCFA',
        'gray-fg': '#6B6860',
      },
      fontFamily: {
        sans:    ['var(--font-jost)', 'sans-serif'],
        display: ['var(--font-cormorant)', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
