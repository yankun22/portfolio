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
          DEFAULT: '#030712',
          deep: '#010309',
          card: 'rgba(11, 15, 25, 0.85)',
          surface: '#0F172A',
        },
        grid: {
          DEFAULT: '#1E1B4B',
          glow: 'rgba(30, 27, 75, 0.4)',
        },
        neon: {
          cyan: '#06B6D4',
          magenta: '#D946EF',
          violet: '#8B5CF6',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glass-panel': '0 8px 32px 0 rgba(0, 0, 0, 0.75), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'glow-cyan': '0 0 25px -4px rgba(6, 182, 212, 0.45)',
        'glow-magenta': '0 0 25px -4px rgba(217, 70, 239, 0.45)',
        'glow-emerald': '0 0 25px -4px rgba(16, 185, 129, 0.45)',
      },
    },
  },
  plugins: [],
};
