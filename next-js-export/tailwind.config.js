module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#2C2C2C",
        primary: "#816CFF",
        secondary: "#EFC88B",
        tertiary: "#BDFFEA",
        "text-main": "#F3F4F6",
        "text-muted": "#9CA3AF",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-lora)", "serif"],
      },
    },
  },
  plugins: [],
};
