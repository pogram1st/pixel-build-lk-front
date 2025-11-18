import { defineStore } from 'pinia'
import { authApi, type AuthResponse } from '@shared/api/authApi'
import { CookieNames } from '@shared/config/cookies'

interface User {
  id: number
  email: string
  name: string
  role: 'USER' | 'ADMIN'
}

interface AuthState {
  user: User | null
  accessToken: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'ADMIN'
  },

  actions: {
    async login(email: string, password: string) {
      const { data } = await authApi.login({ email, password })
      this.setAuth(data)
      return { data }
    },

    async register(email: string, password: string, name: string, phone?: string) {
      const { data } = await authApi.register({ email, password, name, phone })
      this.setAuth(data)
      return { data }
    },

    setAuth(data: AuthResponse) {
      this.user = data.user
      this.accessToken = data.accessToken
      
      const tokenCookie = useCookie<string | null>(CookieNames.ACCESS_TOKEN, {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false
      })
      tokenCookie.value = data.accessToken
    },

    setUser(user: User) {
      this.user = user
    },

    setToken(token: string) {
      this.accessToken = token
    },

    async initialize() {
      const tokenCookie = useCookie<string | null>(CookieNames.ACCESS_TOKEN, {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false,
        default: () => null
      })

      const token = tokenCookie.value
      
      if (!token) {
        return
      }

      try {
        this.setToken(token)
        const { data } = await authApi.getMe()
        this.setUser(data)
      } catch (error) {
        this.logout()
      }
    },

    logout() {
      this.user = null
      this.accessToken = null
    }
  }
})

