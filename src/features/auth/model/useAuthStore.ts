import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, type AuthResponse, type UserResponse } from '@shared/api/authApi'
import * as userApi from '@shared/api/userApi'
import { CookieNames } from '@shared/config/cookies'

interface User {
    id: number
    email: string
    phone?: string
    username: string // username содержит имя пользователя
    role?: {
        type: string
        name: string
    }
}

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref<User | null>(null)
    const accessToken = ref<string | null>(null)

    // Computed (getters)
    const isAuthenticated = computed(() => !!user.value)
    const isAdmin = computed(
        () => user.value?.role?.type === 'admin' || user.value?.role?.type === 'Admin'
    )

    // Actions
    const login = async (email: string, password: string) => {
        const data = await authApi.login({ email, password })
        setAuth(data)
        return { data }
    }

    const register = async (email: string, password: string, name: string, phone?: string) => {
        const data = await authApi.register({
            username: email.split('@')[0],
            email,
            password,
            name,
            phone,
        })
        setAuth(data)
        return { data }
    }

    const setAuth = (data: AuthResponse) => {
        // Преобразуем Strapi user формат в наш внутренний формат
        user.value = {
            id: data.user.id,
            email: data.user.email,
            phone: data.user.phone,
            username: data.user.username, // username содержит имя
            role: data.user.role,
        }
        // Используем accessToken (преобразованный из jwt)
        accessToken.value = data.accessToken

        const tokenCookie = useCookie<string | null>(CookieNames.ACCESS_TOKEN, {
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false,
        })
        tokenCookie.value = data.accessToken
    }

    const setUser = (userData: UserResponse) => {
        user.value = {
            id: userData.id,
            email: userData.email,
            phone: userData.phone,
            username: userData.username,
            role: userData.role,
        }
    }

    const setToken = (token: string) => {
        accessToken.value = token
    }

    const initialize = async () => {
        const tokenCookie = useCookie<string | null>(CookieNames.ACCESS_TOKEN, {
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false,
            default: () => null,
        })

        const token = tokenCookie.value

        if (!token) {
            return
        }

        try {
            setToken(token)
            const userData = await userApi.userApi.getMe()

            if (userData) {
                setUser(userData)
            } else {
                logout()
            }
        } catch (error) {
            logout()
        }
    }

    const logout = () => {
        user.value = null
        accessToken.value = null

        // Очищаем куку accessToken
        const tokenCookie = useCookie<string | null>(CookieNames.ACCESS_TOKEN, {
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false,
        })
        tokenCookie.value = null
    }

    return {
        // State
        user,
        accessToken,
        // Computed
        isAuthenticated,
        isAdmin,
        // Actions
        login,
        register,
        setAuth,
        setUser,
        setToken,
        initialize,
        logout,
        clearAuth: logout,
    }
})
