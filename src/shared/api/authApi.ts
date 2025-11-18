import api from './api'
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
    role: 'USER' | 'ADMIN'
  }
}

export interface UserResponse {
  id: number
  email: string
  name: string
  role: 'USER' | 'ADMIN'
}

export const authApi = {
  login: (data: LoginDto) => api.post<AuthResponse>(ApiEndpoints.AUTH.LOGIN, data),
  register: (data: RegisterDto) => api.post<AuthResponse>(ApiEndpoints.AUTH.REGISTER, data),
  refresh: () => api.post<AuthResponse>(ApiEndpoints.AUTH.REFRESH),
  resetPassword: (email: string) => api.post(ApiEndpoints.AUTH.RESET_PASSWORD, { email }),
  getMe: () => api.get<UserResponse>(ApiEndpoints.USER.ME)
}

