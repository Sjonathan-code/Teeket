import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14213d',
        mist: '#f4f7fb',
        signal: '#2563eb',
      },
    },
  },
  plugins: [],
};

export default config;
