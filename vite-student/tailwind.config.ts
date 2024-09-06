import type { Config } from "tailwindcss";
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f7ff",
          100: "#dfeeff",
          200: "#b9defe",
          300: "#7bc5fe",
          400: "#34a7fc",
          500: "#0a8ded",
          600: "#006dcb",
          700: "#005bac",
          800: "#054b87",
          900: "#0a3e70",
          950: "#07274a",
        },
      },
    },
  },
  plugins: [],
} as Config;
