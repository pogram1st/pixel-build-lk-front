import api from './api'
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
    getMyOrders: async (): Promise<Array<Order>> => {
        const response = await api.get<Array<Order>>(ApiEndpoints.ORDERS.MY)
        return response.data
    },
    getOrder: async (id: number): Promise<Order> => {
        const response = await api.get<Order>(ApiEndpoints.ORDERS.BY_ID(id))
        return response.data
    },
    create: async (data: CreateOrderDto): Promise<Order> => {
        const response = await api.post<Order>(ApiEndpoints.ORDERS.CREATE, data)
        return response.data
    },
}