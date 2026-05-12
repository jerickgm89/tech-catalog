/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        blueRibbon: {
          50: '#edf7ff',
          100: '#d6ecff',
          200: '#b5dfff',
          300: '#83ccff',
          400: '#48b0ff',
          500: '#1e8eff',
          600: '#0671ff',
          700: '#0061ff',
          800: '#084bc5',
          900: '#0d439b',
          950: '#0e295d',
        },
        background: '#ffffff',
        surface: '#ffffff',
        surfaceAlt: '#edf7ff',
        surfaceBlue: '#d6ecff',
        accent: '#0671ff',
        accentDark: '#0061ff',
        accentSoft: '#83ccff',
        ink: '#0e295d',
        inkSoft: '#0d439b',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(14, 41, 93, 0.06), 0 2px 8px rgba(14, 41, 93, 0.04)',
        cardHover: '0 20px 40px rgba(6, 113, 255, 0.15), 0 0 30px rgba(72, 176, 255, 0.18)',
        glow: '0 10px 30px rgba(6, 113, 255, 0.15)',
        glowStrong: '0 20px 50px rgba(6, 113, 255, 0.25)',
      },
      backgroundImage: {
        'accent-gradient':
          'linear-gradient(135deg, #1e8eff 0%, #0671ff 50%, #0061ff 100%)',
        'soft-blue':
          'linear-gradient(180deg, #edf7ff 0%, #ffffff 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'scale-in': 'scaleIn 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
