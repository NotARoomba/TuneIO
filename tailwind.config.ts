import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/***/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: "IBM Plex Mono",
    },
    screens: {
      "3xs": "380px",
      "2xs": "475px",
      xs: "600px",
      ...defaultTheme.screens,
    },
    extend: {
      dropShadow: {
        doodle: "4px 4px 4px rgb(0, 0, 0, .25)",
      },
      colors: {
        rich_black: {
          DEFAULT: "#01161e",
          100: "#000406",
          200: "#00090c",
          300: "#010d12",
          400: "#011118",
          500: "#01161e",
          600: "#04597b",
          700: "#079cd8",
          800: "#45c6f9",
          900: "#a2e3fc",
        },
        midnight_green: {
          DEFAULT: "#124559",
          100: "#040e12",
          200: "#071c24",
          300: "#0b2935",
          400: "#0f3747",
          500: "#124559",
          600: "#20799c",
          700: "#36a9d6",
          800: "#79c5e4",
          900: "#bce2f1",
        },
        air_force_blue: {
          DEFAULT: "#598392",
          100: "#121a1d",
          200: "#24343a",
          300: "#354e57",
          400: "#476874",
          500: "#598392",
          600: "#769dab",
          700: "#99b6c0",
          800: "#bbced5",
          900: "#dde7ea",
        },
        ash_gray: {
          DEFAULT: "#aec3b0",
          100: "#1f2a20",
          200: "#3e5441",
          300: "#5e7f61",
          400: "#83a386",
          500: "#aec3b0",
          600: "#bdcebf",
          700: "#cedbcf",
          800: "#dee7df",
          900: "#eff3ef",
        },
        pastel_green: "#C6E9C9",
        pastel_red: "#E86666",
        lime_green: "#C6E9C9",
        beige: {
          DEFAULT: "#eff6e0",
          100: "#384915",
          200: "#71912a",
          300: "#a4cc4e",
          400: "#c9e197",
          500: "#eff6e0",
          600: "#f2f8e6",
          700: "#f5f9ec",
          800: "#f8fbf2",
          900: "#fcfdf9",
        },
      },
      keyframes: {
        animatedgradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        show: {
          "0%": { opacity: "0", visibility: "visible" },
          "100%": { opacity: "100", zIndex: "50" },
        },
        hide: {
          "0%": { opacity: "100" },
          "100%": { opacity: "0", display: "none", zIndex: "-50" },
        },
        lettersAnimation: {
          "0%": {
            transform: "translateY(0) rotate(0deg)",
            opacity: "0.4",
            borderRadius: "0",
          },
          "100%": {
            transform: "translateY(-1000%) rotate(720deg)",
            opacity: "0",
            borderRadius: "50%",
          },
        },
      },
      animation: {
        show: "show 500ms ease forwards",
        hide: "hide 500ms ease forwards",
        animatedLetters: "lettersAnimation 25s linear infinite",
      },
      boxShadow: {
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
        "inner-lg":
          "inset 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 3px 6px 0 rgba(0, 0, 0, 0.08)",
        "inner-xl":
          "inset 0 4px 8px 0 rgba(0, 0, 0, 0.1), inset 0 6px 10px 0 rgba(0, 0, 0, 0.08)",
        figma: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
        "inner-figma": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.25)",
        "inner-figma-lg": "inset 0 6px 4px 0 rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;
