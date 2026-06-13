/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Warm neutral ramp derived from the pearl canvas
        pearl: { 50: "#FDFBF7", 100: "#F7F4ED", 200: "#EDE9DF", 300: "#D9D4C7" },
        // Brand greens
        pine: { 700: "#2A4A39", 800: "#1B3B2B", 900: "#122B1F" },
        sage: { 100: "#EDF3F0", 300: "#D7E4DD", 500: "#6B8F7E", 600: "#4F7263", 700: "#3E5A4E" },
        // Body text
        ink: "#1E293B",
      },
      boxShadow: {
        // Brand-tinted elevation instead of generic gray
        pine: "0 4px 24px rgba(27,59,43,0.06)",
        "pine-lg": "0 8px 32px rgba(27,59,43,0.10)",
      },
      fontFamily: {
        ui: ["var(--font-ui)"],
        read: ["var(--font-read)"],
        quran: ["var(--font-amiri)"],
      },
    },
  },
  plugins: [],
};
