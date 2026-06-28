/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(${name}) / <alpha-value>)`;

module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // All brand colors are CSS variables so the theme can flip (light/dark) in one place.
        white: v("--surface"),     // page & card surfaces (themeable)
        cream: v("--cream"),       // text that sits on accent buttons (stays light)
        pinebtn: v("--pinebtn"),   // accent button background (stays dark green)
        ink: v("--ink"),           // body text
        pearl: { 50: v("--pearl-50"), 100: v("--pearl-100"), 200: v("--pearl-200"), 300: v("--pearl-300") },
        pine: { 700: v("--pine-700"), 800: v("--pine-800"), 900: v("--pine-900") },
        sage: { 100: v("--sage-100"), 300: v("--sage-300"), 500: v("--sage-500"), 600: v("--sage-600"), 700: v("--sage-700") },
      },
      boxShadow: {
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
