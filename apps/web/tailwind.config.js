/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest:    '#1A5C2A',
        midgreen:  '#2D8C45',
        greenlight:'#EEF6F0',
        ink:       '#1A1A1A',
        body:      '#3A3A3A',
        muted:     '#6B6B6B',
        border:    '#E2E2E0',
        surface:   '#F4F4F2',
        uj:        '#E87722',
        white:     '#FFFFFF',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body:    ['"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.75rem, 5.5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'h1':      ['clamp(2rem, 3.5vw, 3rem)',       { lineHeight: '1.1',  letterSpacing: '-0.015em' }],
        'h2':      ['clamp(1.5rem, 2.5vw, 2rem)',     { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'h3':      ['clamp(1.1rem, 1.8vw, 1.35rem)',  { lineHeight: '1.3' }],
        'lead':    ['clamp(1.05rem, 1.4vw, 1.2rem)',  { lineHeight: '1.7' }],
        'body':    ['1rem',                            { lineHeight: '1.75' }],
        'small':   ['0.875rem',                        { lineHeight: '1.6' }],
        'xs':      ['0.75rem',                         { lineHeight: '1.5' }],
      },
      spacing: {
        'section': '6rem',
        'section-sm': '4rem',
      },
      maxWidth: {
        'site':  '1200px',
        'prose': '68ch',
      },
    },
  },
  plugins: [],
}
