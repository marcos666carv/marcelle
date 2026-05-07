import type { Config } from 'tailwindcss'

// Stitch Design System tokens applied to web app
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Legacy aliases kept for compatibility
        cream: {
          DEFAULT: '#faf9f5',
          50: '#ffffff',
          100: '#faf9f5',
          200: '#f5f4f0',
          300: '#efeeea',
          400: '#e9e8e4',
        },
        teal: {
          DEFAULT: '#0b3b32',
          50: '#a2d0c3',
          100: '#79a599',
          200: '#3b665c',
          300: '#224e44',
          400: '#0b3b32',
          500: '#00241d',
          600: '#00201a',
        },
        salmon: {
          DEFAULT: '#fe9da9',
          50: '#ffd9dc',
          100: '#ffb2ba',
          200: '#fe9da9',
          300: '#944652',
          400: '#79313d',
        },

        // Stitch full token set
        background: '#faf9f5',
        'on-background': '#1b1c1a',
        primary: '#00241d',
        'primary-container': '#0b3b32',
        'on-primary': '#ffffff',
        'on-primary-container': '#79a599',
        'primary-fixed': '#bdecdf',
        'primary-fixed-dim': '#a2d0c3',
        secondary: '#944652',
        'secondary-container': '#fe9da9',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#79313d',
        surface: '#faf9f5',
        'surface-container': '#efeeea',
        'surface-container-high': '#e9e8e4',
        'surface-container-low': '#f5f4f0',
        'surface-container-lowest': '#ffffff',
        'surface-dim': '#dbdad6',
        'on-surface': '#1b1c1a',
        'on-surface-variant': '#404846',
        outline: '#717976',
        'outline-variant': '#c0c8c4',
        'inverse-surface': '#30312e',
        'inverse-on-surface': '#f2f1ed',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}

export default config
