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
          DEFAULT: '#0D1117',
          deep: '#080B0F',
          card: 'rgba(22, 27, 34, 0.85)',
          surface: '#161B22',
          border: 'rgba(48, 54, 61, 0.85)',
          borderSubtle: 'rgba(255, 255, 255, 0.08)',
        },
        telemetry: {
          teal: '#14B8A6',
          tealGlow: 'rgba(20, 184, 166, 0.35)',
          tealDark: '#0F766E',
          tealLight: '#2DD4BF',
          tealNeon: '#5EEAD4',
          cyan: '#06B6D4',
          amber: '#F59E0B',
          rose: '#F43F5E',
          emerald: '#10B981',
          indigo: '#6366F1',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'telemetry-card': '0 8px 32px 0 rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'glow-teal': '0 0 25px -3px rgba(20, 184, 166, 0.4)',
        'glow-cyan': '0 0 25px -3px rgba(6, 182, 212, 0.4)',
        'glow-amber': '0 0 25px -3px rgba(245, 158, 11, 0.35)',
        'glow-rose': '0 0 25px -3px rgba(244, 63, 94, 0.35)',
      },
    },
  },
  plugins: [],
};
