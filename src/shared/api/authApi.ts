import { authApi } from './api'
import { ApiEndpoints } from '../config/apiEndpoints'

export interface LoginDto {
    email: string
    password: string
}

export interface RegisterDto {
    email: string
    password: string
    name: string
    phone?: string
}

export interface AuthResponse {
    accessToken: string
    user: {
        id: number
        email: string
        name: string
        phone?: string
        role: 'USER' | 'ADMIN'
        createdAt: string
    }
}

export interface UserResponse {
    id: number
    email: string
    name: string
    phone?: string
    role: 'USER' | 'ADMIN'
    createdAt: string
}

export const authApiService = {
    login: async (data: LoginDto): Promise<AuthResponse> => {
        const response = await authApi.post(ApiEndpoints.AUTH.LOGIN, data)
        return response.data
    },
    register: async (data: RegisterDto): Promise<AuthResponse> => {
        const response = await authApi.post(ApiEndpoints.AUTH.REGISTER, data)
        return response.data
    },
    refresh: async (): Promise<{ accessToken: string }> => {
        const response = await authApi.post(ApiEndpoints.AUTH.REFRESH)
        return response.data
    },
    resetPassword: async (email: string) => {
        const response = await authApi.post(ApiEndpoints.AUTH.RESET_PASSWORD, { email })
        return response.data
    },
    getMe: async (): Promise<UserResponse> => {
        const response = await authApi.get(ApiEndpoints.AUTH.ME)
        return response.data
    },
    verify: async (): Promise<{ valid: boolean; user: { id: number; email: string; role: string } }> => {
        const response = await authApi.get(ApiEndpoints.AUTH.VERIFY)
        return response.data
    },
    logout: async (): Promise<{ message: string }> => {
        const response = await authApi.post(ApiEndpoints.AUTH.LOGOUT)
        return response.data
    },
}
