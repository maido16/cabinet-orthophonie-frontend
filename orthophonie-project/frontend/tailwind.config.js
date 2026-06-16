/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ✅ Ajout des polices personnalisées
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'], // Pour le texte courant
        serif: ['"Merriweather"', 'serif'],   // Pour les titres
      },
      // Vos animations existantes sont conservées ici
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
