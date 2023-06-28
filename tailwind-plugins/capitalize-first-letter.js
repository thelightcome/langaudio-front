import plugin from "tailwindcss/plugin";

const capitalizeFirst = plugin(function ({ addUtilities }) {
  const newUtilities = {
    ".capitalize-first:first-letter": {
      textTransform: "uppercase",
    },
  };
  addUtilities(newUtilities, ["responsive", "hover"]);
});

export default capitalizeFirst;
