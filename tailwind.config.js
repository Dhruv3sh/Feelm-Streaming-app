const { heroui } = require("@heroui/react");

module.exports = {
  content: [
    './index.html',    
    './src/**/*.{html,js,jsx,ts,tsx}', 
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',  // Custom breakpoint for small devices
        '3xl': '1600px', // Custom breakpoint for large screens
        '4xl': '2400px'
      },
    },
  },
  darkMode: "dark",
  plugins: [heroui()],
};
