// Типы API, соответствующие монолитному бэкенду (Prisma)

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

// Пользователи
export interface User {
  id: number
  email: string
  name: string
  phone: string | null
  avatar: string | null
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Заказы
export interface Order {
  id: number
  userId: number
  serviceId: number | null
  statusId: number
  assignedAdminId: number | null
  description: string | null
  amount: number | null
  paymentLink: string | null
  clientLink: string | null
  telegram: string | null
  whatsapp: string | null
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    email: string
    name: string
    phone: string | null
  }
  service?: Service
  status?: Status
  assignedAdmin?: {
    id: number
    name: string
    email: string
  }
  comments?: Comment[]
  files?: OrderFile[]
  history?: OrderHistory[]
}

export interface OrderHistory {
  id: number
  orderId: number
  userId: number
  action: string
  description: string | null
  metadata: string | null
  createdAt: string
  user?: {
    id: number
    name: string
    email: string
  }
}

export interface Service {
  id: number
  name: string
  price: number | null
  desc: string | null
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
  updatedAt: string
  author?: User
}

export interface OrderFile {
  id: number
  orderId: number
  type: 'CLIENT_MATERIAL' | 'PROGRESS_SCREENSHOT' | 'ADMIN_FILE'
  filename: string
  path: string
  size: number
  mimeType: string
  uploadedBy: number
  createdAt: string
  updatedAt: string
  url?: string | null // Добавляется на фронте для S3 URL
}

// API ответы
export interface ApiError {
  statusCode: number
  message: string
  error?: string
}

// Типы для форм
export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
}

export interface CreateOrderByAdminDto {
  userId?: number
  clientName: string
  clientEmail: string
  telegram?: string
  whatsapp?: string
  description: string
  clientLink?: string
  amount?: number
  paymentLink?: string
  serviceId?: number
  statusId?: number
  assignedAdminId?: number
}

export interface CreateAdminUserDto {
  email: string
  password: string
  name: string
  phone?: string
  role?: UserRole
}

export interface UpdateAdminUserDto {
  email?: string
  name?: string
  phone?: string
  role?: UserRole
}

export interface ServiceFormData {
  id?: number
  name: string
  price: string
  description?: string
}

export interface StatusFormData {
  id?: number
  name: string
  color: string
  description?: string
  order?: number
}

export interface UserFormData {
  id?: number
  email: string
  name: string
  phone: string
  role: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

// Типы для админки
export interface AdminUser extends Omit<User, 'password'> {
  role: UserRole
}

export interface DashboardStats {
  ordersToday: number
  ordersWeek: number
  ordersInWork: number
  ordersCompleted: number
  ordersAwaitingPayment: number
  recentOrders: Array<{
    id: number
    userId: number
    statusId: number
    description: string | null
    createdAt: string
    user: {
      id: number
      name: string
      email: string
    }
    service?: Service
    status: Status
  }>
}

// Типы для валидации
export interface ValidationError {
  path: string[]
  message: string
}

export interface FormErrors {
  [key: string]: string
}

// Типы для таблиц
export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
}
