import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0b1f3a',
          orange: '#ff6f3c',
          slate: '#1e293b',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
