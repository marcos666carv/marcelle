import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core brand
        cream: '#EDE8E0',       // Warm off-white (era linen)
        teal: '#0b3b32',        // Dark green — text principal
        'teal-dark': '#00241d',
        salmon: '#fe9da9',
        border: '#c0c8c4',
        muted: '#717976',

        // Brand identity palette
        coral: '#E8341A',       // Vermelho — primary accent
        electric: '#1A3CF5',    // Azul elétrico
        mint: '#00E676',        // Verde menta vibrante
        hotpink: '#E878D8',     // Rosa quente
        sage: '#D4DBC5',        // Verde sage — bg principal
        linen: '#EDE8E0',       // Off-white quente
        amber: '#F5A623',       // Âmbar
        sky: '#A8C8F5',         // Azul claro

        // Stitch full token set
        background: '#D4DBC5',
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
        'secondary-fixed': '#ffd9dc',
        'secondary-fixed-dim': '#ffb2ba',
        surface: '#faf9f5',
        'surface-bright': '#faf9f5',
        'surface-container': '#efeeea',
        'surface-container-high': '#e9e8e4',
        'surface-container-highest': '#e3e2df',
        'surface-container-low': '#f5f4f0',
        'surface-container-lowest': '#ffffff',
        'surface-dim': '#dbdad6',
        'surface-tint': '#3b665c',
        'on-surface': '#1b1c1a',
        'on-surface-variant': '#404846',
        outline: '#717976',
        'outline-variant': '#c0c8c4',
        'inverse-surface': '#30312e',
        'inverse-on-surface': '#f2f1ed',
        'inverse-primary': '#a2d0c3',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Urbanist', 'sans-serif'],
        serif: ['var(--font-sans)', 'Urbanist', 'sans-serif'],
        display: ['var(--font-sans)', 'Urbanist', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
        full: '9999px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float1: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(6deg)' },
        },
        float2: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(-8deg)' },
        },
        float3: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(12deg)' },
          '66%': { transform: 'translateY(-18px) rotate(-4deg)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        drawIn: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.95)', opacity: '1' },
          '100%': { transform: 'scale(1.3)', opacity: '0' },
        },
      },
      animation: {
        marquee: 'marquee 18s linear infinite',
        float1: 'float1 4s ease-in-out infinite',
        float2: 'float2 5.5s ease-in-out infinite',
        float3: 'float3 7s ease-in-out infinite',
        'spin-slow': 'spinSlow 20s linear infinite',
        'draw-in': 'drawIn 2s ease-out forwards',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
