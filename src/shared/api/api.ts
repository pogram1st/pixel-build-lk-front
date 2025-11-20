import axios from 'axios'
import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { RouteNames } from '../config/RouteNames'
import { RoutePaths } from '../config/RoutePaths'
import { ApiEndpoints } from '../config/apiEndpoints'
import { CookieNames } from '../config/cookies'

const API_BASE_URL =
    process.env.API_BASE_URL || process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:1337'

/**
 * Helper функция для извлечения данных из Strapi формата ответа
 * Strapi возвращает данные в формате { data: {...}, meta: {...} }
 */
export function unwrapStrapiResponse<T>(
    response: AxiosResponse<{ data: T; meta?: Record<string, unknown> }>
): T {
    return response.data.data
}

/**
 * Helper функция для извлечения данных из массива Strapi формата
 */
export function unwrapStrapiCollection<T>(
    response: AxiosResponse<{ data: T[]; meta?: Record<string, unknown> }>
): T[] {
    return response.data.data || []
}

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

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    } else {
    }
    return config
}

interface RetryableRequest extends InternalAxiosRequestConfig {
    _retry?: boolean
}

async function handle401Error(error: AxiosError, api: AxiosInstance): Promise<AxiosResponse> {
    const originalRequest = error.config as RetryableRequest

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true

        // Strapi не имеет встроенного refresh токена в стандартном виде
        // Если нужно, можно реализовать отдельный endpoint
        // Пока просто перенаправляем на страницу входа
        try {
            const tokenCookie = useCookie(CookieNames.ACCESS_TOKEN)
            tokenCookie.value = null

            if (process.client) {
                await navigateTo(RoutePaths[RouteNames.AUTH_LOGIN] as string)
            }
        } catch {
            // Ignore navigation errors
        }

        return Promise.reject(error)
    }

    return Promise.reject(error)
}

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
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
