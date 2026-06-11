/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        background:      "#0c0a14",
        surface:         "#13101f",
        surfaceHighlight:"#1e1a2e",
        surfaceCard:     "#1a1628",
        primary:         "#a78bfa",
        primaryHover:    "#c4b5fd",
        accent:          "#ec4899",
        accentPink:      "#f472b6",
        textMain:        "#FFFFFF",
        textMuted:       "#a09ab8",
      },
      fontFamily: {
        "dm-sans": ["DM Sans", "sans-serif"],
        sans:      ["DM Sans", "sans-serif"],
        display:   ["Space Grotesk", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%":      { opacity: "0.7", transform: "scale(1.05)" },
        },
        equalize: {
          "0%, 100%": { height: "20%" },
          "50%":      { height: "100%" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-from-bottom-2": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(167,139,250,0.2)" },
          "50%":      { boxShadow: "0 0 40px rgba(167,139,250,0.5)" },
        },
      },
      animation: {
        float:                   "float 4s ease-in-out infinite",
        "pulse-slow":            "pulse-slow 4s ease-in-out infinite",
        equalize:                "equalize 1.2s ease-in-out infinite",
        shimmer:                 "shimmer 2s linear infinite",
        "fade-in":               "fade-in 0.4s ease-out forwards",
        "slide-up":              "slide-up 0.5s ease-out forwards",
        "slide-in-from-bottom-2":"slide-in-from-bottom-2 0.3s ease-out forwards",
        "scale-in":              "scale-in 0.3s ease-out forwards",
        glow:                    "glow 2s ease-in-out infinite",
        "in":                    "slide-in-from-bottom-2 0.3s ease-out forwards",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
