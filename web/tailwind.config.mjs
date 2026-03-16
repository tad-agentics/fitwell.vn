/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg0: '#0E0E0C',
        bg1: '#161614',
        bg2: '#1E1E1A',
        bg3: '#252521',
        bg4: '#2E2E29',
        bgInverse: '#F0EFE9',
        t0: '#F0EFE9',
        t1: '#B8B7B0',
        t2: '#6B6B64',
        t3: '#3A3A35',
        teal: '#2EC4A0',
        tealDim: '#1A7A62',
        amber: '#D4820A',
        risk: '#C0392B',
        border: '#252521',
      },
      fontFamily: {
        primary: ["'Be Vietnam Pro'", 'sans-serif'],
        display: ["'Figtree'", 'sans-serif'],
        mono: ["'DM Mono'", 'monospace'],
      },
    },
  },
  plugins: [],
};
