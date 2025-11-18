import { RoutePaths } from '../config/routes'
import { userApi } from '../../src/shared/api/userApi'
import { CookieNames } from '../../src/shared/config/cookies'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const pathname = url.pathname
  const cookies = parseCookies(event)
  const token = cookies[CookieNames.ACCESS_TOKEN]
  
  const isGuestPage = pathname.startsWith(RoutePaths.AUTH_PREFIX)
  const isAdminPage = pathname.startsWith(RoutePaths.ADMIN_PREFIX)
  const isRootPage = pathname === '/' || pathname === ''
  const isProtectedPage = !isGuestPage && !isRootPage
  
  if (isRootPage) {
    if (!token) {
      return sendRedirect(event, RoutePaths.AUTH_LOGIN, 307)
    }
    
    const user = await userApi.getMeFromServer(token)
    if (user) {
      const redirectTo = user.role === 'ADMIN' ? RoutePaths.ADMIN_DASHBOARD : RoutePaths.DASHBOARD
      return sendRedirect(event, redirectTo, 307)
    }
    
    return sendRedirect(event, RoutePaths.AUTH_LOGIN, 307)
  }
  
  if (!token) {
    if (isProtectedPage || isAdminPage) {
      return sendRedirect(event, RoutePaths.AUTH_LOGIN, 307)
    }
    return
  }
  
  const user = await userApi.getMeFromServer(token)
  
  if (!user) {
    if (isProtectedPage || isAdminPage) {
      return sendRedirect(event, RoutePaths.AUTH_LOGIN, 307)
    }
    return
  }
  
  if (isGuestPage) {
    const redirectTo = user.role === 'ADMIN' ? RoutePaths.ADMIN_DASHBOARD : RoutePaths.DASHBOARD
    return sendRedirect(event, redirectTo, 307)
  }
  
  if (isAdminPage && user.role !== 'ADMIN') {
    return sendRedirect(event, RoutePaths.DASHBOARD, 307)
  }
})
