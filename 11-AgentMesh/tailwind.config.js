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
          DEFAULT: '#08090C',
          deep: '#050608',
          card: '#0D1117',
          surface: '#121720',
          border: 'rgba(255, 255, 255, 0.10)',
        },
        mint: {
          DEFAULT: '#2EE59D',
          glow: 'rgba(46, 229, 157, 0.35)',
          dim: '#187953',
        },
        cyber: {
          cyan: '#38BDF8',
          purple: '#A855F7',
          amber: '#F59E0B',
          rose: '#F43F5E',
          blue: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.65), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'glass-glow': '0 0 25px -3px rgba(46, 229, 157, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'glow-cyan': '0 0 25px -3px rgba(56, 189, 248, 0.3)',
        'glow-purple': '0 0 25px -3px rgba(168, 85, 247, 0.3)',
        'glow-amber': '0 0 25px -3px rgba(245, 158, 11, 0.3)',
        'glow-rose': '0 0 25px -3px rgba(244, 63, 94, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
