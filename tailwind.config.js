/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", 
  theme: {
    extend: {
      colors: {
        background: {
          light: "#F5F5F7",
          dark: "#1E1E2F",
        },
        foreground: {
          light: "#333333",
          dark: "#E5E7EB",
        },
        muted: {
          light: "#6B7280",
          dark: "#9CA3AF",
        },
        secondary: {
          light: "#60A5FA",
          DEFAULT: "#2563EB",
          dark: "#2563EB",
        },
      },
    },
  },
  plugins: [],
};

export default config;
