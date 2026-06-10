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
        },
        sand: {
          50:  '#faf9f7',
          100: '#f5f0e8',
          200: '#ede4d3',
          300: '#d9c9a8',
        },
        coral: {
          400: '#fb7185',
          500: '#f43f5e',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
