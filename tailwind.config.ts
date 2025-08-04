import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: "var(--whiteText)",
        black:"var(--blackText)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        green: {
          50: "var(--bgGreen50)",
          100: "var(--bgGreen100)",
          200: "var(--borderGreen200)",
          500: "var(--textGreen500)",
          600: "var(--textGreen600)",
          800:"var(--textGreen800)",
        },
        gray: {
          50: "var(--bgGray50)",
          100: "var(--bgGray100)",
          200:"var(--borderGray200)",
          400: "var(--textGray400)",
          500: "var(--textGray500)",
          600: "var(--textGray600)",
          700: "var(--textGray700)",
          800: "var(--textGray800)",
          900: "var(--textGray900)"
        },
        blue: {
          50: "var(--bgBlue50)",
          100: "var(--bgBlue100)",
          200: "var(--borderBlue200)",
          500: "var(--textBlue500)",
          600: "var(--textBlue600)",
          700: "var(--textBlue700)",
        },
        red: {
          50: "var(--bgRed50)",
          100: "var(--bgRed100)",
          200: "var(--borderRed200)",
          600: "var(--textRed600)",
          700: "var(--textRed700)",
        },
        orange: {
          50: "var(--bgOrange50)",
          100: "var(--bgOrange100)",
          500: "var(--textOrange500)",
          600: "var(--textOrange600)",
        },
        purple: {
          50: "var(--bgPurple50)",
          100: "var(--bgPurple100)",
          500: "var(--textPurple500)",
          600: "var(--textPurple600)",
        },
        yellow: {
          50: "var(--bgYellow50)",
          200: "var(--borderYellow200)",
          100: "var(--bgYellow100)",
          600: "var(--textYellow600)",
          700: "var(--textYellow700)"
        },
        cyan: {
          50: "var(--bgCyan50)",
          100: "var(--bgCyan100)",
          200: "var(--borderCyan200)",
          600: "var(--textCyan600)",
        },
        slate: {
          800: 'var(--slate800)', // optional override
          900: 'var(--slate900)', // optional override
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
