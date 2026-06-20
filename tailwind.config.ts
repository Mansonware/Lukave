import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "var(--font-inter)", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          raised: "hsl(var(--surface-raised))",
          overlay: "hsl(var(--surface-overlay))",
        },
        "border-subtle": "hsl(var(--border-subtle))",
        "border-strong": "hsl(var(--border-strong))",
        nexus: {
          purple: "hsl(var(--nexus-purple))",
          blue: "hsl(var(--nexus-blue))",
          green: "hsl(var(--nexus-green))",
          orange: "hsl(var(--nexus-orange))",
          pink: "hsl(var(--nexus-pink))",
          cyan: "hsl(var(--nexus-cyan))",
        },
      },
      borderRadius: {
        "2xl": "var(--radius-2xl)",
        xl: "var(--radius-xl)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "glow-purple": "var(--shadow-glow-purple)",
        "glow-cyan": "var(--shadow-glow-cyan)",
        "glow-pink": "var(--shadow-glow-pink)",
        "glow-green": "var(--shadow-glow-green)",
        premium: "var(--shadow-lg)",
        "premium-xl": "var(--shadow-xl)",
      },
      backgroundImage: {
        "nexus-gradient": "var(--gradient-brand)",
        "nexus-gradient-soft": "var(--gradient-brand-soft)",
        "nexus-warm": "var(--gradient-warm)",
        "nexus-cool": "var(--gradient-cool)",
        "nexus-mesh": "var(--gradient-mesh)",
        "nexus-radial":
          "radial-gradient(120% 120% at 50% 0%, hsl(258 100% 70% / 0.18) 0%, hsl(240 22% 3% / 0) 55%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-blur": {
          from: { opacity: "0", transform: "translateY(12px)", filter: "blur(8px)" },
          to: { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(258 100% 70% / 0.5)" },
          "50%": { boxShadow: "0 0 0 12px hsl(258 100% 70% / 0)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.6", filter: "blur(24px)" },
          "50%": { opacity: "0.95", filter: "blur(36px)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-3px)" },
          "75%": { transform: "translateX(3px)" },
        },
        "heart-pop": {
          "0%": { transform: "scale(1)" },
          "20%": { transform: "scale(0.85)" },
          "50%": { transform: "scale(1.25)" },
          "100%": { transform: "scale(1)" },
        },
        "aurora-spin": {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.1)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out both",
        "fade-in-blur": "fade-in-blur 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "slide-up": "slide-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "scale-in": "scale-in 0.3s cubic-bezier(0.22,1,0.36,1) both",
        "gradient-shift": "gradient-shift 8s linear infinite",
        "float-y": "float-y 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-out infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
        shake: "shake 0.4s ease-in-out",
        "heart-pop": "heart-pop 0.45s cubic-bezier(0.22,1,0.36,1)",
        "spin-slow": "spin-slow 2.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
