import api, { unwrapStrapiResponse } from './api'
import { ApiEndpoints } from '../config/apiEndpoints'

const API_BASE_URL =
    process.env.API_BASE_URL || process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:1337'

export interface User {
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

export interface UpdateUserDto {
    name?: string
    email?: string
    username?: string
    phone?: string
    currentPassword?: string
    password?: string // Strapi использует password вместо newPassword
}

export const userApi = {
    getMe: async () => {
        const response = await api.get<User>(ApiEndpoints.AUTH.ME)
        // /api/users/me возвращает данные напрямую, не в формате { data: {...} }
        const result = response.data
        return result
    },
    update: async (id: number, data: UpdateUserDto) => {
        const response = await api.put<{ data: User }>(ApiEndpoints.USER.UPDATE(id), { data })
        return unwrapStrapiResponse(response)
    },
    getMeFromServer: async (token: string): Promise<User | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}${ApiEndpoints.AUTH.ME}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const result = await response.json()

                // /api/users/me возвращает данные напрямую, не в формате { data: {...} }
                const user = result.data || result
                return user
            }

            return null
        } catch (error) {
            console.error('getMeFromServer - error:', error) // Отладка
            return null
        }
    },
}
