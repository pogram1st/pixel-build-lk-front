import api, { unwrapStrapiResponse, unwrapStrapiCollection } from './api'
import { ApiEndpoints } from '../config/apiEndpoints'

export interface Order {
    id: number
    userId?: number
    user?: {
        id: number
        email: string
        name: string
    }
    serviceId?: number
    service?: {
        id: number
        name: string
        price?: number
    }
    statusId?: number
    status?: {
        id: number
        name: string
        color: string
        order: number
    }
    assignedAdminId?: number
    assignedAdmin?: {
        id: number
        email: string
        name: string
    }
    description?: string
    amount?: number
    paymentLink?: string
    clientLink?: string
    telegram?: string
    whatsapp?: string
    comments?: Comment[]
    files?: OrderFile[]
    history?: OrderHistory[]
    createdAt: string
    updatedAt: string
}

export interface Comment {
    id: number
    text: string
    orderId?: number
    author?: {
        id: number
        email: string
        name: string
    }
    createdAt: string
}

export interface OrderFile {
    id: number
    type: 'CLIENT_MATERIAL' | 'PROGRESS_SCREENSHOT' | 'ADMIN_FILE'
    filename: string
    path: string
    size?: number
    mimeType?: string
    uploadedBy?: number
    createdAt: string
    file?: {
        url: string
        name: string
        size: number
    }
}

export interface OrderHistory {
    id: number
    action: string
    description?: string
    metadata?: Record<string, unknown>
    user?: {
        id: number
        email: string
        name: string
    }
    createdAt: string
}

export interface CreateOrderDto {
    serviceId?: number
    description?: string
    amount?: number
    clientLink?: string
    telegram?: string
    whatsapp?: string
}

export const orderApi = {
    getMyOrders: async () => {
        const response = await api.get<{ data: Order[]; meta?: Record<string, unknown> }>(
            ApiEndpoints.ORDERS.MY
        )
        return unwrapStrapiCollection(response)
    },
    getOrder: async (id: number) => {
        const response = await api.get<{ data: Order }>(ApiEndpoints.ORDERS.BY_ID(id))
        return unwrapStrapiResponse(response)
    },
    create: async (data: CreateOrderDto) => {
        const response = await api.post<{ data: Order }>(ApiEndpoints.ORDERS.CREATE, { data: data })
        return unwrapStrapiResponse(response)
    },
}
