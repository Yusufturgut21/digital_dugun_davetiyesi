import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF6F0",
        gold: "#C9A84C",
        "gold-light": "#E8D5A3",
        "gold-dark": "#9A7B2F",
        beige: "#F5EDD8",
        "warm-gray": "#8B8178",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Jost", "Inter", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "fade-in-up": "fadeInUp 1s ease forwards",
        shimmer: "shimmer 2s infinite",
        "pulse-gold": "pulseGold 3s ease-in-out infinite",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(201,168,76,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(201,168,76,0.6)" },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};

export default config;
