// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  // Настройка для работы с src/ директорией
  srcDir: 'src/',
  // Папка server для серверных middleware и API routes
  serverDir: 'server',
  css: ['~/app/styles/main.css'], // Путь относительно srcDir (src/app/styles/main.css)
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000'
    },
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production'
  },
  ssr: true,
  // Отключаем анимации переходов между страницами для SSR
  app: {
    head: {
      title: 'Pixel Build - Личный кабинет',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    },
    pageTransition: false,
    layoutTransition: false
  },
  // Алиасы для FSD архитектуры
  alias: {
    '@app': '~/app',
    '@pages': '~/pages',
    '@widgets': '~/widgets',
    '@features': '~/features',
    '@entities': '~/entities',
    '@shared': '~/shared',
  },
  // Явно указываем директорию для middleware (относительно srcDir)
  dir: {
    middleware: 'middleware'
  },
  // Настройка роутера для редиректа с "/"
  router: {
    options: {
      strict: false
    }
  },
})

