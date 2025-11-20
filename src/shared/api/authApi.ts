import api, { unwrapStrapiResponse } from './api'
import { ApiEndpoints } from '../config/apiEndpoints'
import { CookieNames } from '../config/cookies'

export interface LoginDto {
    identifier: string // Strapi использует identifier вместо email
    password: string
}

export interface RegisterDto {
    username: string
    email: string
    password: string
    name: string
    phone?: string
}

export interface AuthResponse {
    accessToken: string // Переименовываем jwt в accessToken для совместимости
    user: {
        id: number
        username: string
        email: string
        name?: string
        phone?: string
        role?: {
            type: string
            name: string
        }
        confirmed: boolean
        blocked: boolean
        createdAt: string
        updatedAt: string
    }
}

export interface UserResponse {
    id: number
    username: string
    email: string
    name?: string
    phone?: string
    role?: {
        id: number
        type: string
        name: string
    }
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
}

export const authApi = {
    login: async (data: { email: string; password: string }) => {
        // Strapi требует identifier вместо email
        const response = await api.post(ApiEndpoints.AUTH.LOGIN, {
            identifier: data.email,
            password: data.password,
        })

        // Стандартный Strapi endpoint возвращает данные напрямую, не в формате { data: {...} }
        const strapiData = response.data

        // Преобразуем jwt в accessToken для совместимости с фронтендом
        const result = {
            accessToken: strapiData.jwt,
            user: strapiData.user,
        }

        return result
    },
    register: async (data: RegisterDto) => {
        // Используем стандартный Strapi endpoint для регистрации (работает корректно)
        const response = await api.post(ApiEndpoints.AUTH.REGISTER, {
            username: data.name || data.username || data.email.split('@')[0], // Используем name как username
            email: data.email,
            password: data.password,
            // Примечание: phone не поддерживается стандартным endpoint
            // Его можно добавить через отдельный запрос после регистрации
        })

        // Стандартный endpoint возвращает данные напрямую
        const strapiData = response.data

        // Если есть phone, обновляем пользователя (name уже в username)
        if (data.phone) {
            try {
                await api.put(`/api/users/${strapiData.user.id}`, {
                    phone: data.phone,
                })
            } catch (updateError) {
                console.warn('Could not update user with phone:', updateError)
            }
        }

        // Преобразуем jwt в accessToken для совместимости с фронтендом
        const result = {
            accessToken: strapiData.jwt,
            user: {
                ...strapiData.user,
                name: data.name || null,
                phone: data.phone || null,
            },
        }

        return result
    },
    refresh: async () => {
        // Strapi не имеет встроенного refresh, можно использовать повторный запрос /api/users/me
        // Для полноценного refresh нужно будет реализовать кастомный endpoint
        throw new Error('Refresh not implemented for Strapi yet')
    },
    resetPassword: async (email: string) => {
        const response = await api.post(ApiEndpoints.AUTH.RESET_PASSWORD, { email })
        return response.data
    },
    getMe: async () => {
        const response = await api.get<UserResponse>(ApiEndpoints.AUTH.ME)
        return unwrapStrapiResponse(response)
    },
}
