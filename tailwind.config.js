/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        md: '2rem',
        lg: '2rem',
        xl: '2rem',
        '2xl': '3rem',
      },
    },
    extend: {
      colors: {
        // Zippd design system: warm cream canvas kept intentionally, ink /
        // accent / success / border pushed to the bolder Gen-Z palette.
        // These are the real, global tokens now — every page reads them
        // (a page only looks "old" where it still opts into `font-display`
        // for Fraunces instead of `font-manrope`).
        bg: {
          DEFAULT: '#FAF7F2',
          alt: '#F5EFE7',
        },
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#0A0A0A',
          soft: '#6B7280',
          muted: '#9CA3AF',
        },
        accent: {
          DEFAULT: '#FF3D2E',
          hover: '#E5321F',
          soft: '#FFECEA',
        },
        electric: '#FFD400',
        success: '#00C853',
        border: '#E8E2D6',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'Manrope', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        manrope: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        content: '1280px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.04)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-once': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'pulse-once': 'pulse-once 0.5s ease-out 1',
      },
    },
  },
  plugins: [],
}
