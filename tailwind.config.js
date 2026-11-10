/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F8F2',
        mist: '#EDF2E8',
        ink: '#24382D',
        forest: '#2E5240',
        moss: '#6B8A5C',
        sage: '#B7CBAE',
        lotus: '#C77C8E',
        gold: '#C9A55A',
        muted: '#6E7B71',
        line: 'rgba(46,82,64,0.14)',
        // Darker text-safe companions (WCAG AA on --paper) for small text.
        'moss-ink': '#4F6B42',
        'muted-ink': '#5A675D',
        'lotus-ink': '#B0607A',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Jost', 'system-ui', 'sans-serif'],
        sanskrit: ['"Tiro Devanagari Sanskrit"', 'serif'],
      },
      maxWidth: { content: '1120px' },
    },
  },
  plugins: [],
}
