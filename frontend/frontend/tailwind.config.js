/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          canvas: "#faf9f5",
          "surface-card": "#efe9de",
          primary: "#cc785c",
          "primary-active": "#a9583e",
          ink: "#141413",
          body: "#3d3d3a",
          muted: "#6c6a64",
          hairline: "#e6dfd8",
          // Officer palette
          "off-canvas": "#0A0F16",
          "off-surface": "#0F1620",
          "off-primary": "#3FD9C7",
          "off-primary-active": "#2ab8a3",
          "off-ink": "#E8EDF3",
          "off-body": "#8CA0B5",
          "off-muted": "#5B6C80",
          "off-hairline": "#233042",
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
