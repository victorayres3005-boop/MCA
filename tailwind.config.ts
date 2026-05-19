import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // MCA brand — teal
        brand: {
          50:  "#E0F5F3",
          100: "#B2E4E1",
          500: "#00B4A6",
          700: "#0A7B72",
          900: "#054F4A",
        },
        // MCA secondary — navy
        navy: {
          600: "#163D5C",
          700: "#0D2B45",
        },
        // Surface tokens
        surface: {
          page:   "#F8FAFB",
          card:   "#FFFFFF",
          input:  "#F1F5F5",
          border: "#E2E8E8",
        },
        // Text tokens
        text: {
          primary:   "#0F1F1F",
          secondary: "#4A6060",
          disabled:  "#94A3A3",
        },
        // Semáforos / status
        status: {
          green:  "#16A34A",
          yellow: "#F59E0B",
          red:    "#DC2626",
          blue:   "#2563EB",
          purple: "#9333EA",
          gray:   "#6B7280",
        },
        "status-green": "#16A34A",
        "status-red":   "#DC2626",
        // shadcn/ui CSS variable bridge
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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(110deg, #0D2B45 0%, #0D2B45 40%, #0A7B72 75%, #00B4A6 100%)",
        "brand-gradient-card": "linear-gradient(135deg, #0D2B45 0%, #163D5C 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
