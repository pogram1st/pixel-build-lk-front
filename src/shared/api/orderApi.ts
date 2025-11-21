import api, { unwrapStrapiResponse, unwrapStrapiCollection } from './api'
import { ApiEndpoints } from '../config/apiEndpoints'
import type { Order } from '../types/api'

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