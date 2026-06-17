/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest:     '#1A5C2A',
        midgreen:   '#2D8C45',
        greenlight: '#EEF6F0',
        ink:        '#1A1A1A',
        slate:      '#6B6B6B',
        border:     '#E2E2E0',
        surface:    '#F4F4F2',
        mist:       '#E8E6E0',
      },
      fontFamily: {
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
