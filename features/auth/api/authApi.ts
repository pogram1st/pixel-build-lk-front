import api from '~/shared/api/api'

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

export const authApi = {
  login: (data: LoginDto) => api.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterDto) => api.post<AuthResponse>('/auth/register', data),
  refresh: () => api.post<AuthResponse>('/auth/refresh'),
  resetPassword: (email: string) => api.post('/auth/reset-password', { email })
}

