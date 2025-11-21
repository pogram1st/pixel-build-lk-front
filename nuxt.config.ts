// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint'
  ],
  // Настройка для работы с src/ директорией
  srcDir: 'src/',
  // Папка server для серверных middleware и API routes
  serverDir: 'server',
  css: ['~/app/styles/main.css'], // Путь относительно srcDir (src/app/styles/main.css)
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:1337',
      authFrontendUrl: process.env.AUTH_FRONTEND_URL || 'http://localhost:3005'
    },
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
  // Явно указываем директории (относительно srcDir)
  dir: {
    middleware: 'middleware',
    layouts: 'app/layouts'
  },
  // Настройка роутера для редиректа с "/"
  router: {
    options: {
      strict: false
    }
  },
  // Настройка TypeScript
  typescript: {
    typeCheck: true
  },
})

