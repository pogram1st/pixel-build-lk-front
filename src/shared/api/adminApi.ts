import api from './api'
import { ApiEndpoints } from '../config/apiEndpoints'
import type { Service, Status, AdminUser, Order, OrderFile, Comment, DashboardStats, CreateOrderByAdminDto, CreateAdminUserDto, UpdateAdminUserDto } from '../types/api'

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

export const adminApi = {
    services: {
        getAll: async (): Promise<Array<Service>> => {
            const response = await api.get<Array<Service>>(ApiEndpoints.ADMIN.SERVICES.ALL)
            return response.data
        },
        create: async (data: { name: string; price?: number; desc?: string }): Promise<Service> => {
            const response = await api.post<Service>(ApiEndpoints.ADMIN.SERVICES.ALL, data)
            return response.data
        },
        update: async (id: number, data: { name?: string; price?: number; desc?: string }): Promise<Service> => {
            const response = await api.put<Service>(ApiEndpoints.ADMIN.SERVICES.BY_ID(id), data)
            return response.data
        },
        delete: async (id: number): Promise<void> => {
            await api.delete(ApiEndpoints.ADMIN.SERVICES.BY_ID(id))
        },
    },
    statuses: {
        getAll: async (): Promise<Array<Status>> => {
            const response = await api.get<Array<Status>>(ApiEndpoints.ADMIN.STATUSES.ALL)
            return response.data
        },
        create: async (data: { name: string; color: string; order: number }): Promise<Status> => {
            const response = await api.post<Status>(ApiEndpoints.ADMIN.STATUSES.ALL, data)
            return response.data
        },
        update: async (id: number, data: { name?: string; color?: string; order?: number }): Promise<Status> => {
            const response = await api.put<Status>(ApiEndpoints.ADMIN.STATUSES.BY_ID(id), data)
            return response.data
        },
        delete: async (id: number): Promise<void> => {
            await api.delete(ApiEndpoints.ADMIN.STATUSES.BY_ID(id))
        },
    },
    users: {
        getAll: async (): Promise<Array<Omit<AdminUser, 'password'>>> => {
            const response = await api.get<Array<Omit<AdminUser, 'password'>>>(ApiEndpoints.ADMIN.USERS.ALL)
            return response.data
        },
        create: async (data: CreateAdminUserDto): Promise<Omit<AdminUser, 'password'>> => {
            const response = await api.post<Omit<AdminUser, 'password'>>(ApiEndpoints.ADMIN.USERS.ALL, data)
            return response.data
        },
        update: async (id: number, data: UpdateAdminUserDto): Promise<Omit<AdminUser, 'password'>> => {
            const response = await api.put<Omit<AdminUser, 'password'>>(
                ApiEndpoints.ADMIN.USERS.BY_ID(id),
                data
            )
            return response.data
        },
        delete: async (id: number): Promise<void> => {
            await api.delete(ApiEndpoints.ADMIN.USERS.BY_ID(id))
        },
    },
    orders: {
        getAll: async (): Promise<Array<Order>> => {
            const response = await api.get<Array<Order>>(ApiEndpoints.ADMIN.ORDERS.ALL)
            return response.data
        },
        getById: async (id: number): Promise<Order> => {
            const response = await api.get<Order>(ApiEndpoints.ADMIN.ORDERS.BY_ID(id))
            return response.data
        },
        create: async (data: CreateOrderByAdminDto): Promise<Order> => {
            const response = await api.post<Order>(ApiEndpoints.ADMIN.ORDERS.CREATE, data)
            return response.data
        },
        update: async (id: number, data: UpdateOrderDto): Promise<Order> => {
            const response = await api.put<Order>(ApiEndpoints.ADMIN.ORDERS.UPDATE(id), data)
            return response.data
        },
        updateStatus: async (id: number, data: { statusId: number }): Promise<Order> => {
            const response = await api.put<Order>(
                ApiEndpoints.ADMIN.ORDERS.UPDATE_STATUS(id),
                data
            )
            return response.data
        },
        uploadFile: async (
            orderId: number,
            file: File,
            type: 'CLIENT_MATERIAL' | 'PROGRESS_SCREENSHOT' | 'ADMIN_FILE'
        ): Promise<OrderFile & { url: string }> => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', type)
            const response = await api.post<OrderFile & { url: string }>(
                ApiEndpoints.ADMIN.ORDERS.UPLOAD_FILE(orderId),
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            )
            return response.data
        },
        deleteFile: async (orderId: number, fileId: number): Promise<{ message: string }> => {
            const response = await api.delete<{ message: string }>(
                ApiEndpoints.ADMIN.ORDERS.DELETE_FILE(orderId, fileId)
            )
            return response.data
        },
    },
    dashboard: {
        getStats: async (): Promise<DashboardStats> => {
            const response = await api.get<DashboardStats>(ApiEndpoints.ADMIN.DASHBOARD.STATS)
            return response.data
        },
    },
    comments: {
        create: async (data: { orderId: number; text: string }): Promise<Comment> => {
            const response = await api.post<Comment>(ApiEndpoints.ADMIN.COMMENTS.CREATE(data.orderId), { text: data.text })
            return response.data
        },
    },
}