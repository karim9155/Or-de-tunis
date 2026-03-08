import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        almarai: ['var(--font-almarai)', 'sans-serif'],
        kufi: ['var(--font-noto-kufi)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(160 20% 88%)',
        primary: {
          DEFAULT: '#064e3b',
          foreground: '#fdfbf7',
        },
        secondary: {
          DEFAULT: '#c2410c',
          foreground: '#fdfbf7',
        },
        accent: {
          DEFAULT: '#d4af37',
          foreground: '#064e3b',
        },
        muted: {
          DEFAULT: '#f3f0ed',
          foreground: '#78716c',
        },
        card: {
          DEFAULT: '#fdfbf7',
          foreground: '#064e3b',
        },
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        slideUp: 'slideUp 0.5s ease-out',
        fadeIn: 'fadeIn 0.5s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
