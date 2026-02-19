/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        retro: {
          bg: '#050505', // Darker black
          surface: '#0f140d', // Very dark green tint
          text: '#33ff00',
          dim: '#1a3300',
          border: '#2a5500', // Mid-tone for borders
          accent: '#ffcc00',
          alert: '#ff0033',
          muted: '#55aa55' // Readable secondary text
        }
      },
      fontFamily: {
        mono: ['"Courier New"', 'Courier', 'monospace'],
        retro: ['"Press Start 2P"', 'cursive', 'monospace'] 
      }
    },
  },
  plugins: [],
}
