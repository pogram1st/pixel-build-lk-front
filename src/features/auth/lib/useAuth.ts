import { useAuthStore } from '../model/useAuthStore'
import { CookieNames } from '@shared/config/cookies'

export function useAuth() {
  const authStore = useAuthStore()
  const tokenCookie = useCookie(CookieNames.ACCESS_TOKEN, {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false
  })

  const saveAuth = (user: any, token: string) => {
    authStore.setUser(user)
    authStore.setToken(token)
    tokenCookie.value = token
  }

  const clearToken = () => {
    authStore.logout()
    tokenCookie.value = null
  }

  return {
    saveAuth,
    clearToken
  }
}

