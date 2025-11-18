import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { RouteNames } from '../config/RouteNames'
import { RoutePaths } from '../config/RoutePaths'
import { ApiEndpoints } from '../config/apiEndpoints'
import { CookieNames } from '../config/cookies'

const API_BASE_URL = process.env.API_BASE_URL || process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

function getTokenFromCookie(): string | null {
  try {
    const tokenCookie = useCookie(CookieNames.ACCESS_TOKEN)
    return tokenCookie.value || null
  } catch {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';')
      const tokenCookie = cookies.find(c => c.trim().startsWith(`${CookieNames.ACCESS_TOKEN}=`))
      if (tokenCookie) {
        return tokenCookie.split('=')[1]?.trim() || null
      }
    }
    return null
  }
}

function addTokenToRequest(config: any): any {
  const token = getTokenFromCookie()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

async function handle401Error(error: any, api: AxiosInstance): Promise<any> {
  const originalRequest = error.config

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}${ApiEndpoints.AUTH.REFRESH}`,
        {},
        { withCredentials: true }
      )

      const tokenCookie = useCookie(CookieNames.ACCESS_TOKEN)
      tokenCookie.value = data.accessToken

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
      return api(originalRequest)
    } catch {
      const tokenCookie = useCookie(CookieNames.ACCESS_TOKEN)
      tokenCookie.value = null
      await navigateTo(RoutePaths[RouteNames.AUTH_LOGIN] as string)
      return Promise.reject(error)
    }
  }

  return Promise.reject(error)
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(addTokenToRequest, (error) => Promise.reject(error))
api.interceptors.response.use((response) => response, (error) => handle401Error(error, api))

export default api

