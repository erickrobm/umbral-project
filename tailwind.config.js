/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#13ecc8",
                "primary-dark": "#0fbda0",
                "background-light": "#f6f8f8",
                "background-dark": "#10221f",
                "surface-light": "#ffffff",
                "surface-dark": "#162e2a",
                "card-light": "#ffffff",
                "card-dark": "#182d2a",
                "text-main": "#111817",
                "text-muted": "#618983",
                "border-light": "#dbe6e4",
                "border-dark": "#2a423e"
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            animation: {
                "bounce-in": "bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
                "fade-in": "fadeIn 0.3s ease-out forwards",
            },
            keyframes: {
                "bounce-in": {
                    "0%": { transform: "scale(0.9)", opacity: "0" },
                    "50%": { transform: "scale(1.05)", opacity: "1" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                }
            }
        },
    },
    plugins: [],
}
