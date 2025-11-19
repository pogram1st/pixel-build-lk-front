import { RouteNames } from '../../src/shared/config/RouteNames'
import { RoutePaths } from '../../src/shared/config/RoutePaths'
import { userApi } from '../../src/shared/api/userApi'
import { CookieNames } from '../../src/shared/config/cookies'

const API_BASE_URL = process.env.API_BASE_URL || process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

async function checkSetup() {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 секунды таймаут
    
    const response = await fetch(`${API_BASE_URL}/admin/setup/check`, {
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const data = await response.json()
      return data.needsSetup === true
    }
    // Если бэкенд вернул ошибку, предполагаем что setup нужен (безопаснее)
    return true
  } catch (error: any) {
    // Если бэкенд недоступен, предполагаем что setup нужен (первый запуск)
    if (error.name !== 'AbortError') {
      console.warn('Backend not available, assuming setup needed:', error.message)
    }
    return true
  }
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const pathname = url.pathname
  const cookies = parseCookies(event)
  const token = cookies[CookieNames.ACCESS_TOKEN]
  
  const AUTH_LOGIN = RoutePaths[RouteNames.AUTH_LOGIN] as string
  const AUTH_PREFIX = '/auth'
  const ADMIN_PREFIX = '/admin'
  const ADMIN_SETUP = '/admin/setup'
  const ADMIN_DASHBOARD = RoutePaths[RouteNames.ADMIN_DASHBOARD] as string
  const DASHBOARD = RoutePaths[RouteNames.DASHBOARD] as string
  
  const isGuestPage = pathname.startsWith(AUTH_PREFIX)
  const isAdminPage = pathname.startsWith(ADMIN_PREFIX)
  const isSetupPage = pathname === ADMIN_SETUP
  const isRootPage = pathname === '/' || pathname === ''
  const isProtectedPage = !isGuestPage && !isRootPage
  
  // Проверить, нужна ли настройка (нет админов)
  const needsSetup = await checkSetup()
  
  // Если нужна настройка, разрешить доступ только к странице setup
  if (needsSetup) {
    // Если это не страница setup - редирект на setup (включая auth/login и все остальные)
    if (!isSetupPage) {
      return sendRedirect(event, ADMIN_SETUP, 307)
    }
    // Если это страница setup - разрешить доступ
    return
  }
  
  // Если настройка не нужна, но пользователь на странице setup - редирект на dashboard
  if (!needsSetup && isSetupPage) {
    return sendRedirect(event, ADMIN_DASHBOARD, 307)
  }
  
  if (isRootPage) {
    if (!token) {
      return sendRedirect(event, AUTH_LOGIN, 307)
    }
    
    const user = await userApi.getMeFromServer(token)
    if (user) {
      const redirectTo = user.role === 'ADMIN' ? ADMIN_DASHBOARD : DASHBOARD
      return sendRedirect(event, redirectTo, 307)
    }
    
    return sendRedirect(event, AUTH_LOGIN, 307)
  }
  
  if (!token) {
    if (isProtectedPage || (isAdminPage && !isSetupPage)) {
      return sendRedirect(event, AUTH_LOGIN, 307)
    }
    return
  }
  
  const user = await userApi.getMeFromServer(token)
  
  if (!user) {
    if (needsSetup && isAdminPage && !isSetupPage) {
      return sendRedirect(event, ADMIN_SETUP, 307)
    }
    if (isProtectedPage || (isAdminPage && !isSetupPage)) {
      return sendRedirect(event, AUTH_LOGIN, 307)
    }
    return
  }
  
  if (isGuestPage) {
    const redirectTo = user.role === 'ADMIN' ? ADMIN_DASHBOARD : DASHBOARD
    return sendRedirect(event, redirectTo, 307)
  }
  
  if (isAdminPage && user.role !== 'ADMIN') {
    return sendRedirect(event, DASHBOARD, 307)
  }
})
