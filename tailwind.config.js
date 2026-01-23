/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3599B0",
        secondary: "#0A192F",
        "background-light": "##F2F0EF", 
        "background-dark": "#020617",
        accent: "#f59e0b",
        brand: {
          DEFAULT: "#3599B0",
          soft: "#d97706",
          gold: "#D4AF37",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f8fafc",
          elevated: "#ffffff",
        },
        text: {
          primary: "#0A192F",
          secondary: "#475569",
          muted: "#64748b",
          inverse: "#ffffff",
        },
        border: {
          DEFAULT: "#e2e8f0",
          subtle: "#f1f5f9",
        },
        state: {
          error: "#ef4444",
          success: "#22c55e",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
        heading: ["Playfair Display", "serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
      fontSize: {
        'heading-xl': ['3rem', { lineHeight: '1.25', letterSpacing: '0' }],
        'heading-lg': ['2.25rem', { lineHeight: '1.25', letterSpacing: '0' }],
        'heading-md': ['1.875rem', { lineHeight: '1.25', letterSpacing: '0' }],
        'heading-sm': ['1.5rem', { lineHeight: '1.25', letterSpacing: '0' }],
        'heading-xs': ['1.25rem', { lineHeight: '1', letterSpacing: '0' }],
        'body': ['1.125rem', { lineHeight: '1.625', letterSpacing: '0' }],
        'body-sm': ['0.875rem', { lineHeight: '1.625', letterSpacing: '0' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0' }],
      },
      fontWeight: {
        heading: '700',
        body: '400',
        emphasis: '700',
      },
      spacing: {
        'page-x': '1rem',
        'page-y': '8rem',
        'section': '3rem',
        'card': '2rem',
        'stack': '2rem',
      },
      borderRadius: {
        DEFAULT: "1rem",
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        card: '2rem',
        button: '9999px',
        badge: '9999px',
      },
      boxShadow: {
        card: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        elevated: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'gold-glow': '0 0 12px rgba(212, 175, 55, 0.2), 0 0 24px rgba(212, 175, 55, 0.15)',
        'brand-glow': '0 0 12px rgba(53, 153, 176, 0.2), 0 0 24px rgba(53, 153, 176, 0.15)',
      },
      keyframes: {
        'gold-glow': {
          '0%, 100%': {
            boxShadow: '0 0 12px rgba(212, 175, 55, 0.2), 0 0 24px rgba(212, 175, 55, 0.15)',
          },
          '50%': {
            boxShadow: '0 0 18px rgba(212, 175, 55, 0.35), 0 0 36px rgba(212, 175, 55, 0.25)',
          },
        },
        'brand-glow': {
          '0%, 100%': {
            boxShadow: '0 0 12px rgba(53, 153, 176, 0.2), 0 0 24px rgba(53, 153, 176, 0.15)',
          },
          '50%': {
            boxShadow: '0 0 18px rgba(53, 153, 176, 0.35), 0 0 36px rgba(53, 153, 176, 0.25)',
          },
        },
      },
      animation: {
        'gold-glow': 'gold-glow 3s ease-in-out infinite',
        'brand-glow': 'brand-glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
