import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        brand: {
          black: "#0A0A0A",
          amber: "#F59E0B",
          "amber-dark": "#D97706",
          "amber-light": "#FCD34D",
          white: "#F9FAFB",
          zinc: "#18181B",
          "zinc-800": "#27272A",
          "zinc-700": "#3F3F46",
          "zinc-600": "#52525B",
          "zinc-400": "#A1A1AA",
          "zinc-300": "#D4D4D8",
          "zinc-200": "#E4E4E7",
          "zinc-100": "#F4F4F5",
        },
      },
      fontFamily: {
        heading: ["var(--font-montserrat)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "brand-hero":
          "linear-gradient(135deg, #0A0A0A 0%, #18181B 50%, #0A0A0A 100%)",
        "brand-card":
          "linear-gradient(145deg, #18181B 0%, #27272A 100%)",
        "amber-glow":
          "radial-gradient(ellipse at center, rgba(245,158,11,0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        amber: "0 0 20px rgba(245, 158, 11, 0.3)",
        "amber-lg": "0 0 40px rgba(245, 158, 11, 0.2)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 8px 40px rgba(0, 0, 0, 0.6)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "pulse-amber": "pulseAmber 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseAmber: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};

export default config;
