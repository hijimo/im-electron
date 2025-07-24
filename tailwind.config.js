/** @type {import('tailwindcss').Config} */
// import { generateTailwindTheme } from '@/theme/tailwind-bridge';
const { generateTailwindTheme } = require("./src/theme/tailwind-bridge");

module.exports = {
  mode: "jit",
  content: [
    "./components/**/*.{js,ts,jsx,tsx,less}",
    "./context/**/*.{js,ts,jsx,tsx,less}",
    "./src/**/*.{js,ts,jsx,tsx,less,}",
    "./src/app/**/*.{js,ts,jsx,tsx,less}",
    "./src/components/**/*.{js,ts,jsx,tsx,less}",
    "./src/pages/**/*.{js,ts,jsx,tsx,less}",
    "./src/context/**/*.{js,ts,jsx,tsx,less}",
  ],
  theme: {
    extend: {
      ...generateTailwindTheme(import.meta.env.VITE_THEME_COLOR), // 主题色修改

      divideColor: {
        default: "var(--gap-text)",
      },
      padding: {
        1.5: "0.375rem",
        2.5: "0.625rem",
        3.5: "0.875rem",
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
      },
      margin: {
        2.5: "0.625rem",
        3.5: "0.875rem",
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
      },
      width: {
        10.5: "2.625rem",
      },
      height: {
        10.5: "2.625rem",
      },
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/typography"), require("tailwind-scrollbar-hide")],

  // https://github.com/tailwindlabs/tailwindcss/discussions/5969
  corePlugins: {
    preflight: false,
  },
};
