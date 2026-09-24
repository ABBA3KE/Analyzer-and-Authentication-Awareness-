/**
 * Design tokens — premium dark-navy cybersecurity SaaS direction.
 * Single-family typography (Inter) at varied weights for an enterprise feel;
 * a system monospace stack is reserved for technical readouts (entropy, IDs).
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050B14",
          900: "#0A1424",
          850: "#0D1A2E",
          800: "#112238",
          700: "#17293F",
          600: "#213A54",
          500: "#2E4E6D",
        },
        mist: {
          500: "#5E7590",
          400: "#7E93AC",
          300: "#A4B6C9",
          200: "#C9D5E2",
          100: "#EAF0F7",
        },
        signal: {
          50: "#EAF2FF",
          200: "#9CC4FF",
          400: "#5B9DFF",
          DEFAULT: "#3D84F5",
          dim: "#2564D6",
          900: "#0F2E5C",
        },
        success: { DEFAULT: "#2FBF87", dim: "#1F9C6D", bg: "rgba(47,191,135,0.12)" },
        warning: { DEFAULT: "#E8AC3E", dim: "#C68B23", bg: "rgba(232,172,62,0.12)" },
        danger: { DEFAULT: "#EF5A6F", dim: "#D33D53", bg: "rgba(239,90,111,0.12)" },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        // Aliases kept so existing font-display / font-body utility classes
        // continue to resolve — both now point at Inter for one consistent
        // enterprise typeface instead of a mixed display/body pairing.
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(2,8,20,0.4), 0 0 0 1px rgba(255,255,255,0.03)",
        raised: "0 8px 24px -8px rgba(2,8,20,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
        glow: "0 0 0 1px rgba(61,132,245,0.35), 0 0 24px -4px rgba(61,132,245,0.35)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(5,11,20,0) 0%, rgba(5,11,20,1) 85%), radial-gradient(60% 50% at 50% 0%, rgba(61,132,245,0.14) 0%, rgba(61,132,245,0) 60%)",
        "mesh-glow":
          "radial-gradient(40% 60% at 15% 10%, rgba(61,132,245,0.16) 0%, rgba(61,132,245,0) 60%), radial-gradient(35% 45% at 90% 20%, rgba(47,191,135,0.10) 0%, rgba(47,191,135,0) 60%)",
      },
      keyframes: {
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        "fade-up": { from: { opacity: 0, transform: "translateY(6px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        "scale-in": { from: { opacity: 0, transform: "scale(0.97)" }, to: { opacity: 1, transform: "scale(1)" } },
        shimmer: { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "fade-up": "fade-up 0.35s cubic-bezier(0.16,1,0.3,1)",
        "scale-in": "scale-in 0.2s cubic-bezier(0.16,1,0.3,1)",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
