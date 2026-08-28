/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: '#050505',
        obsidian: '#0b0c0d',
        surface: {
          50: '#08090a',
          100: '#0b0c0d',
          200: '#121316',
          300: '#181a1e',
          400: '#22242a',
        },
        titanium: {
          DEFAULT: '#f9fafb',
          light: '#ffffff',
          muted: '#a1a1aa',
          dark: '#52525b',
        },
        platinum: {
          DEFAULT: '#f9fafb',
          light: '#ffffff',
          muted: '#a1a1aa',
          dark: '#52525b',
        },
        champagne: {
          DEFAULT: '#d4af37',
          light: '#e5c07b',
          dark: '#b89628',
          shimmer: '#f5e6b8',
          glow: 'rgba(212, 175, 55, 0.08)',
        },
        ochre: {
          DEFAULT: '#d4af37',
          light: '#e5c07b',
          dark: '#996515',
        },
        accent: {
          shimmer: '#f5e6b8',
          champagne: '#d4af37',
          titanium: '#f9fafb',
        }
      },
      fontFamily: {
        serif: ['var(--font-italiana)', 'var(--font-cinzel)', 'Georgia', 'serif'],
        display: ['var(--font-cinzel)', 'var(--font-syne)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-plus-jakarta-sans)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      boxShadow: {
        'luxury-card': '0 8px 32px 0 rgba(0, 0, 0, 0.85), inset 0 1px 0 0 rgba(255, 255, 255, 0.07)',
        'luxury-hover': '0 24px 48px 0 rgba(0, 0, 0, 0.95), 0 0 32px -4px rgba(212, 175, 55, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.18)',
        'noir-card': '0 8px 32px 0 rgba(0, 0, 0, 0.85), inset 0 1px 0 0 rgba(255, 255, 255, 0.07)',
        'noir-hover': '0 24px 48px 0 rgba(0, 0, 0, 0.95), 0 0 32px -4px rgba(212, 175, 55, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.18)',
        'pill-active': '0 0 25px rgba(212, 175, 55, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
        'champagne-glow': '0 0 35px rgba(212, 175, 55, 0.25)',
        'titanium-glow': '0 0 25px rgba(255, 255, 255, 0.15)',
      },
      letterSpacing: {
        'tighter-editorial': '-0.03em',
        'widest-telemetry': '0.25em',
      }
    },
  },
  plugins: [],
};
