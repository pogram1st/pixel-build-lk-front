import axios from 'axios'
import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { RouteNames } from '../config/RouteNames'
import { RoutePaths } from '../config/RoutePaths'
import { CookieNames } from '../config/cookies'

function getApiBase(): string {
  const config = useRuntimeConfig()
  // Используем относительный путь через прокси
  return config.public.apiBase || '/api'
}

const API_BASE = getApiBase()

function getTokenFromCookie(): string | null {
  try {
    const tokenCookie = useCookie(CookieNames.ACCESS_TOKEN)
    return tokenCookie.value || null
  } catch {
    // Fallback для браузера и сервера
    if (process.server) {
      // На сервере пытаемся получить из заголовков
      try {
        const event = useRequestEvent()
        if (event) {
          const cookies = parseCookies(event)
          return cookies[CookieNames.ACCESS_TOKEN] || null
        }
      } catch {
        return null
      }
    }

    if (typeof document !== 'undefined') {
      // Fallback для браузера
      const cookies = document.cookie.split(';')
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === CookieNames.ACCESS_TOKEN) {
          return value || null
        }
      }
    }
    return null
  }
}

function addTokenToRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = getTokenFromCookie()

  if (token && typeof token === 'string') {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean
}

async function handle401Error(error: AxiosError, api: AxiosInstance): Promise<AxiosResponse> {
  const originalRequest = error.config
  if (!originalRequest) {
    return Promise.reject(error)
  }
  
  const retryableRequest = originalRequest as RetryableRequest
  const hasRetried = retryableRequest._retry === true

  if (error.response?.status === 401 && !hasRetried) {
    retryableRequest._retry = true

    // Очищаем токены
    try {
      const tokenCookie = useCookie(CookieNames.ACCESS_TOKEN)
      tokenCookie.value = null

          if (process.client) {
            // Редиректим на централизованный сервис авторизации
            const currentUrl = window.location.href
            const config = useRuntimeConfig()
            const authFrontendUrl = config.public.authFrontendUrl || 'http://localhost:3005'
            const redirectUrl = `${authFrontendUrl}/login?redirect=${encodeURIComponent(currentUrl)}`
            
            window.location.href = redirectUrl
          }
    } catch {
      // Ignore navigation errors
    }

    return Promise.reject(error)
  }

  return Promise.reject(error)
}

// API для монолитного бэкенда (через прокси)
const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(addTokenToRequest, error => Promise.reject(error))
api.interceptors.response.use(
  response => response,
  error => handle401Error(error, api)
)

export default api
// Экспортируем api как authApi для обратной совместимости
export const authApi = api
