/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F172A', // dark navy
        surface: '#1E293B',    // slightly lighter slate for cards
        primary: '#14B8A6',    // teal accent
        textPrimary: '#F1F5F9', // off-white
        textMuted: '#94A3B8',  // gray
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        custom: '0 4px 24px rgba(0,0,0,0.3)',
      }
    },
  },
  plugins: [],
}
