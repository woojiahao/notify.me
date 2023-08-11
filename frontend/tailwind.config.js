/** @type {import('tailwindcss').Config} */
module.exports = {
  // mode: 'jit',
  // purge: [
  //   './public/**/*.html',
  //   './src/**/*.{js,jsx,ts,tsx}',
  // ],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: [
        "Inter",
        "Josefin Sans",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
    },
    extend: {
      colors: {
        "background-light": "#E7F2F8",
        aquamarine: "#74BDCB",
      },
    },
  },
  plugins: [],
};
