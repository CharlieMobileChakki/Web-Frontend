/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#A98C43",
        secondary: "#C6363E",
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(to right, #DA352D, #374151, #6B7280)", 
        // via-gray-700 (#374151), to-gray-500 (#6B7280)
      },
    },
  },
  plugins: [],
}
