import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
          "Exo 2"
        ],
        'exo': ['Exo 2', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        navy: {
          900: "#0A192F",
          800: "#112240",
          700: "#1A365D",
        },
        cyber: {
          primary: "#64FFDA",
          secondary: "#0A192F",
          accent: "#41E8FF",
        },
      },
      animation: {
        typing: "typing 2s steps(20, end)",
        'tooltip-deploy': 'tooltip-deploy 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        'tooltip-deploy': {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.6) perspective(500px) rotateX(-30deg)',
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1) perspective(500px) rotateX(0)',
          }
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
