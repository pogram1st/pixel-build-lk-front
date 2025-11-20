import api, { unwrapStrapiResponse, unwrapStrapiCollection } from './api'
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
    username: string
    email: string
    name?: string
    phone?: string
    role?: {
        id: number
        type: string
        name: string
    }
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
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
    totalOrders: number
    totalUsers: number
    recentOrders: number
    activeOrders: number
    ordersByStatus: Array<{
        status: Status
        count: number
    }>
}

export interface Comment {
    id: number
    orderId?: number
    text: string
    author?: AdminUser
    createdAt: string
}

export const adminApi = {
    services: {
        getAll: async () => {
            const response = await api.get<{ data: Service[]; meta?: Record<string, unknown> }>(
                ApiEndpoints.ADMIN.SERVICES.ALL
            )
            return unwrapStrapiCollection(response)
        },
        create: async (data: { name: string; price?: number; desc?: string }) => {
            const response = await api.post<{ data: Service }>(ApiEndpoints.ADMIN.SERVICES.ALL, {
                data,
            })
            return unwrapStrapiResponse(response)
        },
        update: async (id: number, data: { name?: string; price?: number; desc?: string }) => {
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
        create: async (data: { name: string; color: string; order: number }) => {
            const response = await api.post<{ data: Status }>(ApiEndpoints.ADMIN.STATUSES.ALL, {
                data,
            })
            return unwrapStrapiResponse(response)
        },
        update: async (id: number, data: { name?: string; color?: string; order?: number }) => {
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
        create: async (data: {
            email: string
            password: string
            name: string
            phone?: string
            role?: 'USER' | 'ADMIN'
        }) => {
            // Strapi создает пользователей через users-permissions plugin
            const response = await api.post<{ data: AdminUser }>(ApiEndpoints.ADMIN.USERS.ALL, {
                data,
            })
            return unwrapStrapiResponse(response)
        },
        update: async (
            id: number,
            data: { email?: string; name?: string; phone?: string; role?: 'USER' | 'ADMIN' }
        ) => {
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
            type: 'CLIENT_MATERIAL' | 'PROGRESS_SCREENSHOT' | 'ADMIN_FILE'
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
        create: async (data: { orderId: number; text: string }) => {
            const response = await api.post<{ data: Comment }>(ApiEndpoints.ADMIN.COMMENTS.CREATE, {
                data,
            })
            return unwrapStrapiResponse(response)
        },
    },
}
