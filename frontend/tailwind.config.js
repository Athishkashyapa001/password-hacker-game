/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617', // Deeper obsidian
        surface: '#0f172a',    // Navy slate
        primary: '#14b8a6',    // Teal
        secondary: '#0891b2',  // Cyan deep
        accent: '#f59e0b',     // Amber accent
        textPrimary: '#f8fafc',
        textMuted: '#94a3b8',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 10px -2px rgba(0, 0, 0, 0.5)',
        'teal-glow': '0 0 20px -5px rgba(20, 184, 166, 0.3)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
      }
    },
  },
  plugins: [],
}
