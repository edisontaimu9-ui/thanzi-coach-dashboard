/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A1310",
        surface: "#0F1D18",
        line: "#1E332B",
        text: "#E8F3EE",
        muted: "#6B8579",
        muted2: "#8AA096",
        green: "#3ECF8E",
        amber: "#F2A65A",
        blue: "#5CC8E8",
        red: "#F2755A",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "SF Mono", "Menlo", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
