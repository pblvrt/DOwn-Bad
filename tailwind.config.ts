import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'spin-grid': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95) rotate(3deg)' },
          '100%': { transform: 'scale(1)' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-20px)', opacity: '0' },
        },
        'coin-pop': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        }
      },
      animation: {
        'spin-grid': 'spin-grid 0.5s ease-in-out',
        'float-up': 'float-up 1s forwards',
        'coin-pop': 'coin-pop 0.5s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
}

export default config