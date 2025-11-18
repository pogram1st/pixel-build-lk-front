import api from '~/shared/api/api'
import type { Order } from '../model/types'

export const orderApi = {
  getMyOrders: () => api.get<Order[]>('/orders/my'),
  getOrder: (id: number) => api.get<Order>(`/orders/${id}`),
  createOrder: (data: { serviceId: number }) => api.post<Order>('/orders', data)
}

