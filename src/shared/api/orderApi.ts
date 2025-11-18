import api from './api'
import { ApiEndpoints } from '../config/apiEndpoints'

export interface Order {
  id: number
  userId: number
  serviceId: number
  statusId: number
  createdAt: string
  updatedAt: string
  service?: {
    id: number
    name: string
    price?: number
  }
  status?: {
    id: number
    name: string
    color: string
  }
}

export interface CreateOrderDto {
  serviceId: number
}

export const orderApi = {
  getMyOrders: () => api.get<Order[]>(ApiEndpoints.ORDERS.MY),
  getOrder: (id: number) => api.get<Order>(ApiEndpoints.ORDERS.BY_ID(id)),
  create: (data: CreateOrderDto) => api.post<Order>(ApiEndpoints.ORDERS.CREATE, data),
}

