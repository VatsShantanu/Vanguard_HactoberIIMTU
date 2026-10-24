/** @type {import('tailwindcss').Config} */
const iris = {
  50: '#F1EFFF', 100: '#E3DFFF', 200: '#CBC4FF', 300: '#AA9FFF', 400: '#8A78FF',
  500: '#6D56FF', 600: '#5A3FF0', 700: '#4A30CC', 800: '#3C2AA3', 900: '#2F2380', 950: '#1C1450',
};

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Warm "ink" neutrals replace the cold default greys
        slate: {
          50: '#F7F6F2', 100: '#EFEDE6', 200: '#E1DED3', 300: '#C9C5B6', 400: '#9C988A',
          500: '#75726A', 600: '#55534C', 700: '#3A3935', 800: '#232220', 900: '#151514', 950: '#0C0C0B',
        },
        // Primary: electric iris
        emerald: iris,
        brand: iris,
        // Secondary: hot magenta (used for gradient partners)
        teal: {
          50: '#FFF0FA', 100: '#FFE0F4', 200: '#FFC2E9', 300: '#FF94D9', 400: '#F862C3',
          500: '#E83CAB', 600: '#CB2490', 700: '#A21A74', 800: '#7F175C', 900: '#5E1445', 950: '#3A0A2A',
        },
        // Signature highlight
        volt: { 200: '#EEFFA8', 300: '#E4FF7A', 400: '#D4FF3A', 500: '#C2F20F', 600: '#9DC400' },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Bricolage Grotesque"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
        'pop': 'pop 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        'bounce-gentle': 'bounceGentle 1.8s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pop: { '0%': { transform: 'scale(0.92)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        bounceGentle: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-3px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      boxShadow: {
        'modal': '0 32px 80px rgba(12,12,11,0.35)',
        'pop': '0 12px 40px rgba(90,63,240,0.25)',
      },
    },
  },
  plugins: [],
}
