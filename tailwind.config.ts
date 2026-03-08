import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        // BlackSwan palette
        bs: {
          black: "#0A0A0A",
          "black-light": "#0D0D0D",
          white: "#F5F5F5",
          "dark-grey": "#2A2A2A",
          grey: "#6B7280",
          "grey-light": "#8B9098",
          blue: "#7CB9E8",
          "blue-dark": "#5A9AC8",
          red: "#E63946",
          green: "#2ECC71",
          amber: "#F4A261",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "'Consolas'", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
