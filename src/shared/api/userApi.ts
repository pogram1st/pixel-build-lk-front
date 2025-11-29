import api from './api'
import { ApiEndpoints } from '../config/apiEndpoints'
import type { User } from '../types/api'

export interface UpdateUserDto {
    name?: string
    email?: string
    phone?: string | null
    currentPassword?: string
    newPassword?: string
    avatar?: string | null
}

export const userApi = {
    getMe: async (): Promise<User> => {
        const response = await api.get<User>(ApiEndpoints.USER.ME)
        return response.data
    },
    update: async (id: number, data: UpdateUserDto): Promise<Omit<User, 'password'>> => {
        const response = await api.put<Omit<User, 'password'>>(ApiEndpoints.USER.UPDATE(id), data)
        return response.data
    },
    getMeFromServer: async (token: string): Promise<User | null> => {
        try {
            const config = useRuntimeConfig()
            const apiBase = config.public.apiBase || '/api'
            const response = await fetch(`${apiBase}${ApiEndpoints.USER.ME}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
            })

            if (response.ok) {
                const result = await response.json()
                return result
            }

            return null
        } catch (error: unknown) {
            console.error('getMeFromServer - error:', error)
            return null
        }
    },
}
