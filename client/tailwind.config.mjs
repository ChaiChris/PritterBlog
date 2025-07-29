import lineClamp from "@tailwindcss/line-clamp";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Oswald", '"Noto Sans TC"', "sans-serif"],
      },
      colors: {
        primary: "#babeb6",
      },
    },
  },
  plugins: [lineClamp],
};
