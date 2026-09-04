/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#0F172A',
          deep: '#090D16',
          card: 'rgba(30, 41, 59, 0.75)',
          surface: '#1E293B',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        violet: {
          DEFAULT: '#A855F7',
          glow: 'rgba(168, 85, 247, 0.35)',
          dark: '#7E22CE',
          light: '#C084FC',
          neon: '#E9D5FF',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'forge-card': '0 8px 32px 0 rgba(0, 0, 0, 0.65), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'glow-violet': '0 0 25px -3px rgba(168, 85, 247, 0.35)',
        'glow-emerald': '0 0 25px -3px rgba(16, 185, 129, 0.35)',
        'glow-sky': '0 0 25px -3px rgba(56, 189, 248, 0.35)',
      },
    },
  },
  plugins: [],
};
