import { light } from '@mui/material/styles/createPalette';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/styles/customComponents.css",
  ],
  important: "#root",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000',  // Primary color
          dark: '#FFFFFF',     // Darker
        },
        headerBg: '#2E3A4A',    // header background color
      },
    },
  },
  corePlugins: {
    preflight: false
  },
  plugins: [],
}

