import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6C5CE7",
          foreground: "#ffffff"
        },
        accent: {
          DEFAULT: "#FF6B6B",
          foreground: "#ffffff"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(108, 92, 231, 0.3)"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out forwards"
      }
    }
  },
  plugins: []
};

export default config;
