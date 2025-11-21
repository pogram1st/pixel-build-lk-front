import api, { unwrapStrapiResponse, unwrapStrapiCollection } from './api'
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
        getAll: async () => {
            const response = await api.get<{ data: Service[]; meta?: Record<string, unknown> }>(
                ApiEndpoints.ADMIN.SERVICES.ALL
            )
            return unwrapStrapiCollection(response)
        },
        create: async (data: { name: string; price?: number; description?: string }) => {
            const response = await api.post<{ data: Service }>(ApiEndpoints.ADMIN.SERVICES.ALL, {
                data,
            })
            return unwrapStrapiResponse(response)
        },
        update: async (id: number, data: { name?: string; price?: number; description?: string }) => {
            const response = await api.put<{ data: Service }>(
                ApiEndpoints.ADMIN.SERVICES.BY_ID(id),
                { data }
            )
            return unwrapStrapiResponse(response)
        },
        delete: async (id: number) => {
            await api.delete(ApiEndpoints.ADMIN.SERVICES.BY_ID(id))
        },
    },
    statuses: {
        getAll: async () => {
            const response = await api.get<{ data: Status[]; meta?: Record<string, unknown> }>(
                ApiEndpoints.ADMIN.STATUSES.ALL
            )
            return unwrapStrapiCollection(response)
        },
        create: async (data: { name: string; color: string; description?: string }) => {
            const response = await api.post<{ data: Status }>(ApiEndpoints.ADMIN.STATUSES.ALL, {
                data,
            })
            return unwrapStrapiResponse(response)
        },
        update: async (id: number, data: { name?: string; color?: string; description?: string }) => {
            const response = await api.put<{ data: Status }>(
                ApiEndpoints.ADMIN.STATUSES.BY_ID(id),
                { data }
            )
            return unwrapStrapiResponse(response)
        },
        delete: async (id: number) => {
            await api.delete(ApiEndpoints.ADMIN.STATUSES.BY_ID(id))
        },
    },
    users: {
        getAll: async () => {
            const response = await api.get<{ data: AdminUser[]; meta?: Record<string, unknown> }>(
                ApiEndpoints.ADMIN.USERS.ALL
            )
            return unwrapStrapiCollection(response)
        },
        create: async (data: CreateAdminUserDto) => {
            // Strapi создает пользователей через users-permissions plugin
            const response = await api.post<{ data: AdminUser }>(ApiEndpoints.ADMIN.USERS.ALL, {
                data,
            })
            return unwrapStrapiResponse(response)
        },
        update: async (id: number, data: UpdateAdminUserDto) => {
            const response = await api.put<{ data: AdminUser }>(
                ApiEndpoints.ADMIN.USERS.BY_ID(id),
                { data }
            )
            return unwrapStrapiResponse(response)
        },
        delete: async (id: number) => {
            await api.delete(ApiEndpoints.ADMIN.USERS.BY_ID(id))
        },
    },
    orders: {
        getAll: async () => {
            const response = await api.get<{ data: Order[]; meta?: Record<string, unknown> }>(
                ApiEndpoints.ADMIN.ORDERS.ALL
            )
            return unwrapStrapiCollection(response)
        },
        getById: async (id: number) => {
            const response = await api.get<{ data: Order }>(ApiEndpoints.ADMIN.ORDERS.BY_ID(id))
            return unwrapStrapiResponse(response)
        },
        create: async (data: CreateOrderByAdminDto) => {
            const response = await api.post<{ data: Order }>(ApiEndpoints.ADMIN.ORDERS.CREATE, {
                data,
            })
            return unwrapStrapiResponse(response)
        },
        update: async (id: number, data: UpdateOrderDto) => {
            const response = await api.put<{ data: Order }>(ApiEndpoints.ADMIN.ORDERS.UPDATE(id), {
                data,
            })
            return unwrapStrapiResponse(response)
        },
        updateStatus: async (id: number, data: { statusId: number }) => {
            const response = await api.put<{ data: Order }>(
                ApiEndpoints.ADMIN.ORDERS.UPDATE_STATUS(id),
                { data }
            )
            return unwrapStrapiResponse(response)
        },
        uploadFile: async (
            orderId: number,
            file: File,
            type: 'client_material' | 'progress_screenshot' | 'admin_file'
        ) => {
            const formData = new FormData()
            formData.append('files', file)
            formData.append('data', JSON.stringify({ type }))
            const response = await api.post<{ data: OrderFile }>(
                ApiEndpoints.ADMIN.ORDERS.UPLOAD_FILE(orderId),
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            )
            return unwrapStrapiResponse(response)
        },
        deleteFile: async (orderId: number, fileId: number) => {
            await api.delete(ApiEndpoints.ADMIN.ORDERS.DELETE_FILE(orderId, fileId))
        },
    },
    dashboard: {
        getStats: async () => {
            const response = await api.get<{ data: DashboardStats }>(
                ApiEndpoints.ADMIN.DASHBOARD.STATS
            )
            return unwrapStrapiResponse(response)
        },
    },
    comments: {
        create: async (data: { orderId: number; content: string }) => {
            const response = await api.post<{ data: Comment }>(ApiEndpoints.ADMIN.COMMENTS.CREATE, {
                data,
            })
            return unwrapStrapiResponse(response)
        },
    },
}