/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
     colors: {
  primary: {
    900: '#0F172A',
    800: '#1E3A8A',
    700: '#1E40AF',
    600: '#2563EB',
  },
  gold: {
    700: '#B45309',
    600: '#F59E0B',
    500: '#FBBF24',
    400: '#FCD34D',
    100: '#FEF3C7',
  },
},
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'scroll': 'scroll 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(79, 70, 229, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(79, 70, 229, 0.6)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [
    
  ],
};