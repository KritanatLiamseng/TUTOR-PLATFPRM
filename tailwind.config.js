/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',   // ให้แน่ใจว่า path ถูกต้อง
    './src/components/**/*.{js,ts,jsx,tsx}',
     "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
