/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // New premium palette
        sea:  '#0077B6',
        sky:  '#90E0EF',
        sun:  '#F4D03F',
        warm: '#FAF3E0',
        dusk: '#1A1A2E',
        mist: '#F0F4F8',
        coral: '#E76F51',
        // Legacy scales (backward compat)
        azure: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        citron: {
          50:  '#fefce8',
          100: '#fef9c3',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        sand: {
          50:  '#faf9f7',
          100: '#f5f0e8',
          200: '#ede4d3',
          300: '#d9c9a8',
          700: '#6b5a3e',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        'card':      '0 2px 8px rgba(0,119,182,0.08)',
        'card-hover':'0 4px 16px rgba(0,119,182,0.15)',
        'sheet':     '0 -8px 32px rgba(0,0,0,0.12)',
        'nav':       '0 -1px 0 rgba(0,0,0,0.08)',
      },
      borderRadius: {
        card:  '16px',
        sheet: '24px',
      },
      animation: {
        'wave':       'wave-drift 20s linear infinite',
        'pulse-soft': 'pulse-soft 5s ease-in-out infinite',
      },
      keyframes: {
        'wave-drift': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
}
