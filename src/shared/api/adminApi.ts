import api from './api'
import { ApiEndpoints } from '../config/apiEndpoints'

export interface Service {
  id: number
  name: string
  price?: number
  desc?: string
}

export interface Status {
  id: number
  name: string
  color: string
  order: number
}

export interface AdminUser {
  id: number
  email: string
  name: string
  phone?: string
  role: 'USER' | 'ADMIN'
}

export interface Order {
  id: number
  userId: number
  serviceId: number
  statusId: number
  createdAt: string
  updatedAt: string
  user?: AdminUser
  service?: Service
  status?: Status
}

export interface Comment {
  id: number
  orderId: number
  text: string
  createdAt: string
}

export const adminApi = {
  services: {
    getAll: () => api.get<Service[]>(ApiEndpoints.ADMIN.SERVICES.ALL),
    create: (data: { name: string; price?: number; desc?: string }) => api.post<Service>(ApiEndpoints.ADMIN.SERVICES.ALL, data),
    update: (id: number, data: { name?: string; price?: number; desc?: string }) => api.put<Service>(ApiEndpoints.ADMIN.SERVICES.BY_ID(id), data),
    delete: (id: number) => api.delete(ApiEndpoints.ADMIN.SERVICES.BY_ID(id)),
  },
  statuses: {
    getAll: () => api.get<Status[]>(ApiEndpoints.ADMIN.STATUSES.ALL),
    create: (data: { name: string; color: string; order: number }) => api.post<Status>(ApiEndpoints.ADMIN.STATUSES.ALL, data),
    update: (id: number, data: { name?: string; color?: string; order?: number }) => api.put<Status>(ApiEndpoints.ADMIN.STATUSES.BY_ID(id), data),
    delete: (id: number) => api.delete(ApiEndpoints.ADMIN.STATUSES.BY_ID(id)),
  },
  users: {
    getAll: () => api.get<AdminUser[]>(ApiEndpoints.ADMIN.USERS.ALL),
    create: (data: { email: string; password: string; name: string; phone?: string; role: 'USER' | 'ADMIN' }) => api.post<AdminUser>(ApiEndpoints.ADMIN.USERS.ALL, data),
    update: (id: number, data: { email?: string; name?: string; phone?: string; role?: 'USER' | 'ADMIN' }) => api.put<AdminUser>(ApiEndpoints.ADMIN.USERS.BY_ID(id), data),
    delete: (id: number) => api.delete(ApiEndpoints.ADMIN.USERS.BY_ID(id)),
  },
  orders: {
    getAll: () => api.get<Order[]>(ApiEndpoints.ADMIN.ORDERS.ALL),
    getById: (id: number) => api.get<Order>(ApiEndpoints.ADMIN.ORDERS.BY_ID(id)),
    updateStatus: (id: number, data: { statusId: number }) => api.put(ApiEndpoints.ADMIN.ORDERS.UPDATE_STATUS(id), data),
  },
  comments: {
    create: (data: { orderId: number; text: string }) => api.post<Comment>(ApiEndpoints.ADMIN.COMMENTS.CREATE, data),
  },
}

