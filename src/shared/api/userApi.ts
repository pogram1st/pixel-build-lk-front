import api from './api'
import { ApiEndpoints } from '../config/apiEndpoints'

const API_BASE_URL = process.env.API_BASE_URL || process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

export interface User {
  id: number
  email: string
  name: string
  phone?: string
  role: 'USER' | 'ADMIN'
}

export interface UpdateUserDto {
  name?: string
  email?: string
  phone?: string
  currentPassword?: string
  newPassword?: string
}

export const userApi = {
  getMe: () => api.get<User>(ApiEndpoints.USER.ME),
  update: (data: UpdateUserDto) => api.put<User>(ApiEndpoints.USER.UPDATE, data),
  getMeFromServer: async (token: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}${ApiEndpoints.USER.ME}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        return await response.json()
      }
      return null
    } catch {
      return null
    }
  },
}

