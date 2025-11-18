import { defineStore } from 'pinia'
import { authApi, type AuthResponse } from '../api/authApi'

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
    },

    async register(email: string, password: string, name: string, phone?: string) {
      const { data } = await authApi.register({ email, password, name, phone })
      this.setAuth(data)
    },

    setAuth(data: AuthResponse) {
      this.user = data.user
      this.accessToken = data.accessToken
      const tokenCookie = useCookie('accessToken')
      tokenCookie.value = data.accessToken
    },

    logout() {
      this.user = null
      this.accessToken = null
      const tokenCookie = useCookie('accessToken')
      tokenCookie.value = null
    }
  }
})

