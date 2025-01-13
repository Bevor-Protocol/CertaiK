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
        modal: {
          "0%": {
            display: "none",
            backgroundColor: "rgba(0, 0, 0, 0)",
            backdropFilter: "blur(0px)",
          },
          "100%": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(1px)",
          },
        },
        appear: {
          "0%": {
            opacity: "0",
            transform: "scale(0.7)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        disapper: {
          "0%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "100%": {
            opacity: "0",
            transform: "scale(0.7)",
          },
        },
        "pulse-more": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: ".2",
          },
        },
      },
      animation: {
        "loading-dots": "dots 2s steps(4, end) infinite",
        modal: "modal 0.25s forwards",
        appear: "appear 0.15s forwards",
        disappear: "disappear 0.15s forwards",
        "pulse-more": "pulse-more 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
