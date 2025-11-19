export interface Order {
  id: number
  userId: number
  serviceId?: number
  statusId: number
  assignedAdminId?: number
  description?: string
  amount?: number // Сумма в копейках
  paymentLink?: string
  clientLink?: string
  telegram?: string
  whatsapp?: string
  createdAt: string
  updatedAt: string
  user?: User
  service?: Service
  status?: Status
  assignedAdmin?: User
  comments?: Comment[]
  files?: OrderFile[]
  history?: OrderHistory[]
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
  user?: User
}

