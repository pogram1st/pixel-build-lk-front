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
  serviceId?: number
  statusId: number
  assignedAdminId?: number
  description?: string
  amount?: number
  paymentLink?: string
  clientLink?: string
  telegram?: string
  whatsapp?: string
  createdAt: string
  updatedAt: string
  user?: AdminUser
  service?: Service
  status?: Status
  assignedAdmin?: AdminUser
  files?: OrderFile[]
  history?: OrderHistory[]
}

export interface OrderFile {
  id: number
  orderId: number
  type: 'CLIENT_MATERIAL' | 'PROGRESS_SCREENSHOT' | 'ADMIN_FILE'
  filename: string
  path: string
  size?: number
  mimeType?: string
  uploadedBy?: number
  createdAt: string
}

export interface OrderHistory {
  id: number
  orderId: number
  userId: number
  action: string
  description?: string
  metadata?: string
  createdAt: string
  user?: AdminUser
}

export interface CreateOrderByAdminDto {
  userId?: number // Если создается для существующего пользователя
  clientName: string
  clientEmail: string
  telegram?: string
  whatsapp?: string
  description: string
  clientLink?: string
  amount?: number
  paymentLink?: string
  serviceId?: number
  statusId: number
  assignedAdminId?: number
  files?: File[] // Файлы для загрузки
}

export interface UpdateOrderDto {
  description?: string
  amount?: number
  paymentLink?: string
  clientLink?: string
  telegram?: string
  whatsapp?: string
  serviceId?: number
  statusId?: number
  assignedAdminId?: number
}

export interface DashboardStats {
  ordersToday: number
  ordersWeek: number
  ordersInWork: number
  ordersCompleted: number
  ordersAwaitingPayment: number
  recentOrders: Order[]
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
    create: (data: CreateOrderByAdminDto) => {
      const formData = new FormData()
      Object.keys(data).forEach((key) => {
        if (key === 'files' && data.files) {
          data.files.forEach((file) => formData.append('files', file))
        } else if (data[key as keyof CreateOrderByAdminDto] !== undefined) {
          formData.append(key, String(data[key as keyof CreateOrderByAdminDto]))
        }
      })
      return api.post<Order>(ApiEndpoints.ADMIN.ORDERS.CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    update: (id: number, data: UpdateOrderDto) => api.put<Order>(ApiEndpoints.ADMIN.ORDERS.UPDATE(id), data),
    updateStatus: (id: number, data: { statusId: number }) => api.put(ApiEndpoints.ADMIN.ORDERS.UPDATE_STATUS(id), data),
    uploadFile: (orderId: number, file: File, type: 'CLIENT_MATERIAL' | 'PROGRESS_SCREENSHOT' | 'ADMIN_FILE') => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      return api.post<OrderFile>(ApiEndpoints.ADMIN.ORDERS.UPLOAD_FILE(orderId), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    deleteFile: (orderId: number, fileId: number) => api.delete(ApiEndpoints.ADMIN.ORDERS.DELETE_FILE(orderId, fileId)),
  },
  dashboard: {
    getStats: () => api.get<DashboardStats>(ApiEndpoints.ADMIN.DASHBOARD.STATS),
  },
  setup: {
    check: () => api.get<{ needsSetup: boolean }>(ApiEndpoints.ADMIN.SETUP.CHECK),
    createFirstAdmin: (data: { email: string; password: string; name: string }) =>
      api.post<AdminUser>(ApiEndpoints.ADMIN.SETUP.CREATE_ADMIN, data),
  },
  comments: {
    create: (data: { orderId: number; text: string }) => api.post<Comment>(ApiEndpoints.ADMIN.COMMENTS.CREATE, data),
  },
}

