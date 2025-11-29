/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,vue,ts}",
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue"
    ],
    safelist: [
        "bg-red-500",
        "bg-green-500"
    ],
    theme: {
        extend: {
            screens: {
                "max-sm": { max: "639px" },
                "max-md": { max: "767px" },
                "max-lg": { max: "1023px" },
                "max-xl": { max: "1279px" },
                "max-2xl": { max: "1535px" }
            },
            animation: {
                "spin-slow": "spin 15s linear infinite"
            },
            keyframes: {
                spin: {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" }
                }
            },
            borderRadius: {
                brand: "26px"
            },
            colors: {
                brand: "#141414",
                brandCard: "rgba(255,255,255,0.05)",
                brandWhite09: "rgba(255, 255, 255, 0.09)",
                brandPink: "#DE365A",
                brandPurple: "#8F51C9",
                brandBlue: "#5FD6CA",
                brandOrange: "#FF6200",
                brandIndigo: "#991258",
                info: "#2291FF",
                info2: "#366AF3",
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                }
            },
            backgroundImage: {
                mainBannerMobile: "linear-gradient(93.51deg, #9B51E0 51.97%, #3081ED 99.18%)",
                brandGradient: "linear-gradient(94deg, #9B51E0 2.84%, #3081ED 99.18%)",
                brandGradient2: "linear-gradient(0deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.40) 100%), linear-gradient(104deg, #9B51E0 21.01%, rgba(48, 129, 237, 0.80) 100%)",
                brandGradient3: "linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), linear-gradient(104deg, #9B51E0 21.01%, rgba(48, 129, 237, 0.80) 100%)",
                brandGradient4: "linear-gradient(94deg, #9B51E0 51.97%, #3081ED 99.18%)"
            },
            boxShadow: {
                brandCard: "2px -2px 20px 0px rgba(214, 214, 214, 0.17) inset",
                headerItem: "2px -2px 16px 2px rgba(214, 214, 214, 0.10)",
                footerItemMobile: "2px -2px 20px 0 rgba(214, 214, 214, 0.17) inset"
            }
        }
    },
    plugins: [],
    darkMode: 'class'
}