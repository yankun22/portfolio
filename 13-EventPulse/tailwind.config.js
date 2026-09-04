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
          DEFAULT: '#0B0F19',
          deep: '#060911',
          card: 'rgba(15, 23, 42, 0.75)',
          surface: '#111827',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        ultra: {
          DEFAULT: '#8B5CF6',
          glow: 'rgba(139, 92, 246, 0.35)',
          dark: '#6D28D9',
          light: '#A78BFA',
        },
        warn: {
          DEFAULT: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.35)',
          dark: '#B45309',
        },
        mint: {
          DEFAULT: '#10B981',
          glow: 'rgba(16, 185, 129, 0.35)',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'cockpit-card': '0 8px 32px 0 rgba(0, 0, 0, 0.65), inset 0 1px 0 0 rgba(255, 255, 255, 0.07)',
        'glow-ultra': '0 0 25px -3px rgba(139, 92, 246, 0.35)',
        'glow-amber': '0 0 25px -3px rgba(245, 158, 11, 0.35)',
        'glow-mint': '0 0 25px -3px rgba(16, 185, 129, 0.35)',
      },
    },
  },
  plugins: [],
};
