/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
    background: "var(--background)",
    foreground: "var(--foreground)",

    primary: "var(--primary)",
    "primary-foreground": "var(--primary-foreground)",

    secondary: "var(--secondary)",
    "secondary-foreground": "var(--secondary-foreground)",

    muted: "var(--muted)",
    "muted-foreground": "var(--muted-foreground)",

    accent: "var(--accent)",
    "accent-foreground": "var(--accent-foreground)",

    destructive: "var(--destructive)",
    "destructive-foreground": "var(--destructive-foreground)",

    ring: "var(--ring)",

    "status-normal": "var(--status-normal)",
    "status-warning": "var(--status-warning)",
    "status-critical": "var(--status-critical)",
    
        
      },
    },
  },
  plugins: [],
}
