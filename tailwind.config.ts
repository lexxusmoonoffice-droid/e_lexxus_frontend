import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#0a0a0a",
          accent: "#7c3aed",
        },
      },
      keyframes: {
        "ken-burns": {
          "0%":   { transform: "scale(1.08) translateX(0px)"   },
          "100%": { transform: "scale(1.0)  translateX(-20px)" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)"    },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-left": {
          "0%":   { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)"     },
        },
        "progress": {
          "0%":   { width: "0%" },
          "100%": { width: "100%" },
        },
        "line-grow": {
          "0%":   { width: "0px" },
          "100%": { width: "48px" },
        },
      },
      animation: {
        "ken-burns":     "ken-burns 8s ease-out forwards",
        "fade-up":       "fade-up 0.7s ease-out forwards",
        "fade-up-slow":  "fade-up 1s ease-out forwards",
        "fade-in":       "fade-in 0.6s ease-out forwards",
        "slide-in-left": "slide-in-left 0.7s ease-out forwards",
        "progress":      "progress linear forwards",
        "line-grow":     "line-grow 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
