module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Cores base do GitHub Dark
        background: "#0d1117", 
        foreground: "#c9d1d9",
        muted: "#8b949e",
        border: "#30363d",
        
        // Cores de UI
        primary: {
          DEFAULT: "#238636", // Verde do GitHub
          hover: "#2ea043",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#1f6feb", // Azul do GitHub
          hover: "#388bfd",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#da3633", // Vermelho do GitHub
          hover: "#f85149",
          foreground: "#ffffff", 
        },
        
        // Cores específicas
        card: "#161b22",
        popover: "#161b22",
        accent: "#388bfd20", // Azul com transparência
        
        // Status
        success: "#238636",
        warning: "#9e6a03",
        error: "#f85149",
        
        // Tons neutros
        neutral: {
          50: "#f7f7f7",
          100: "#e6e6e6",
          200: "#cccccc",
          300: "#b3b3b3",
          400: "#999999",
          500: "#808080",
          600: "#666666",
          700: "#4d4d4d",
          800: "#333333",
          900: "#1a1a1a",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system", 
          "BlinkMacSystemFont", 
          "Segoe UI", 
          "Noto Sans", 
          "Helvetica", 
          "Arial", 
          "sans-serif", 
          "Apple Color Emoji", 
          "Segoe UI Emoji"
        ],
        mono: ["Consolas", "Monaco", "Andale Mono", "Ubuntu Mono", "monospace"],
      },
      borderRadius: {
        lg: "0.625rem", // 10px
        md: "0.375rem", // 6px
        sm: "0.25rem",  // 4px
      },
      boxShadow: {
        dropdown: "0 8px 24px rgba(140,149,159,0.2)",
        card: "0 0 0 1px rgba(53,59,69,0.2)",
        medium: "0 3px 6px rgba(0,0,0,0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "spin": "spin 1s linear infinite",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateY(-20px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
    },
  },
  plugins: [], // Removendo plugins que causam erro
}