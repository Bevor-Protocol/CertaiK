import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        dots: {
          "0%": {
            width: "0px",
          },
          "33.33%": {
            width: "10px",
          },
          "66.66%": {
            width: "20px",
          },
          "100%": {
            width: "30px",
          },
        },
      },
      animation: {
        "loading-dots": "dots 2s steps(4, end) infinite",
      },
    },
  },
} satisfies Config;
