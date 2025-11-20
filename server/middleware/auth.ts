import { RouteNames } from '../../src/shared/config/RouteNames'
import { RoutePaths } from '../../src/shared/config/RoutePaths'
import { CookieNames } from '../../src/shared/config/cookies'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const pathname = url.pathname
  const cookies = parseCookies(event)
  const token = cookies[CookieNames.ACCESS_TOKEN]
  
  const AUTH_LOGIN = RoutePaths[RouteNames.AUTH_LOGIN] as string
  const AUTH_PREFIX = '/auth'
  const ADMIN_PREFIX = '/admin'
  const ADMIN_DASHBOARD = RoutePaths[RouteNames.ADMIN_DASHBOARD] as string
  const DASHBOARD = RoutePaths[RouteNames.DASHBOARD] as string

  // Пропускаем API запросы и статические файлы
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_nuxt') || 
      pathname.startsWith('/favicon') ||
      pathname.includes('.')) {
    return
  }

  const isAuthPage = pathname.startsWith(AUTH_PREFIX)
  const isAdminPage = pathname.startsWith(ADMIN_PREFIX)

  // Если нет токена
  if (!token) {
    // Если пытается зайти на защищенную страницу - редирект на логин
    if (!isAuthPage && pathname !== '/') {
      if (pathname !== AUTH_LOGIN) {
        return sendRedirect(event, AUTH_LOGIN, 307)
      }
    }
    return
  }

  // Если есть токен и пытается зайти на страницы авторизации - редирект в кабинет
  if (isAuthPage) {
    if (pathname !== DASHBOARD) {
      return sendRedirect(event, DASHBOARD, 307)
    }
  }

  // Если корневая страница - редирект в кабинет
  if (pathname === '/') {
    return sendRedirect(event, DASHBOARD, 307)
  }
})