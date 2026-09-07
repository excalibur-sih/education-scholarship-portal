/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          primary: "#0f2b5c",      // Deep Government Navy
          secondary: "#1e3a8a",    // State Blue
          light: "#f0f4f8",        // Gov subtle background
          accent: "#d97706",       // Saffron / Warm Gold Accent
          saffron: "#ea580c",      // Indian National Saffron
          green: "#15803d",        // Official verification green
          slate: "#334155",
          border: "#cbd5e1",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
