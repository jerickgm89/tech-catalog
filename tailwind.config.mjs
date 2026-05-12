/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: '#0f0f0f',
        surface: '#1a1a1a',
        surfaceAlt: '#222222',
        accent: '#00d4ff',
        accentDark: '#0099cc',
        accentGlow: 'rgba(0, 212, 255, 0.35)',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(0, 212, 255, 0.25)',
        glowStrong: '0 0 45px rgba(0, 212, 255, 0.45)',
      },
      backgroundImage: {
        'accent-gradient':
          'linear-gradient(135deg, #00d4ff 0%, #0099cc 50%, #006699 100%)',
        'radial-glow':
          'radial-gradient(circle at 20% 0%, rgba(0,212,255,0.15) 0%, rgba(15,15,15,0) 60%)',
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
