import capitalizeFirst from "./tailwind-plugins/capitalize-first-letter";

export default {
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#C00361",
        secondary: "#310A4F",
        tertiary: "#4a4949",
        black: "#000",
        white: "#fff",
        dark: "#020202",
        light: "#f5f5f5",
        error: "#F50000",
      },
      screens: {
        xs: "360px",
      },
      backgroundImage: {
        gradient_1:
          "linear-gradient(45deg, rgb(192, 3, 97) 2%, rgb(49, 10, 79) 100%)",
      },
    },
  },
  plugins: [capitalizeFirst],
};
