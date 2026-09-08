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
          dark: '#212121',
          muted: '#323232',
          primary: '#0D7377',
          'primary-hover': '#095457',
          'primary-light': '#E6F4F4',
          accent: '#14FFEC',
          'accent-glow': 'rgba(20, 255, 236, 0.35)',
          'accent-light': '#D0FFFA',
          bg: '#FAFAFA',
          card: '#FFFFFF',
          border: '#E5E7EB',
          surface: '#F5F5F5'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.06), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        'glow': '0 0 20px rgba(20, 255, 236, 0.35)',
        'glow-teal': '0 0 20px rgba(13, 115, 119, 0.25)',
      },
      borderRadius: {
        'card': '16px',
        'subtle': '12px',
        'pill': '9999px',
      }
    },
  },
  plugins: [],
}
