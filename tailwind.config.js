/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "serif-display": ["Playfair Display", "serif"],
      },
      colors: {
        // Custom gold color palette - replacing gold/rose theme
        gold: {
          DEFAULT: '#e6b71e',
          50: "#fefbf3",
          100: "#fdf6e6",
          200: "#fce9c5",
          300: "#fadea5",
          400: "#f8cd6b",
          500: "#e6b71e", // Primary light gold
          600: "#d4a51c",
          700: "#ae820d", // Primary dark gold
          800: "#8d6809",
          900: "#6d5306",
          950: "#4a3704",
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
      },
      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [],
  // Disable Tailwind's oklch color generation - use rgb instead
  future: {
    respectDefaultRingColorOpacity: true,
  },
};
