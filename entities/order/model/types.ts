export interface Order {
  id: number
  userId: number
  serviceId: number
  statusId: number
  createdAt: string
  updatedAt: string
  user?: User
  service?: Service
  status?: Status
  comments?: Comment[]
}

export interface User {
  id: number
  email: string
  name: string
  phone?: string
  role: 'USER' | 'ADMIN'
}

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

export interface Comment {
  id: number
  orderId: number
  authorId: number
  text: string
  createdAt: string
}

