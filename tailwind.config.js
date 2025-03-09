const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',  // Custom breakpoint for small devices
        '3xl': '1600px', // Custom breakpoint for large screens
        '4xl': '2560px'
      },
    },
  },
  darkMode: "dark",
  plugins: [nextui()],
};
