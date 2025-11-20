// Базовые типы API
export interface BaseEntity {
    id: number
    documentId: string
    createdAt: string
    updatedAt: string
    publishedAt: string
}

// Пользователи
export interface User extends BaseEntity {
    username: string
    email: string
    phone?: string
    confirmed: boolean
    blocked: boolean
    role?: Role
}

export interface Role extends BaseEntity {
    name: string
    description?: string
    type: string
}

// Заказы
export interface Order extends BaseEntity {
    description: string
    amount?: number
    paymentLink?: string
    clientLink?: string
    telegram?: string
    whatsapp?: string
    user?: User
    service?: Service
    status?: Status
    assignedAdmin?: User
    comments?: Comment[]
    files?: OrderFile[]
}

export interface Service extends BaseEntity {
    name: string
    description?: string
    price?: number
}

export interface Status extends BaseEntity {
    name: string
    color?: string
    description?: string
}

export interface Comment extends BaseEntity {
    content: string
    order?: Order
    author?: User
}

export interface OrderFile extends BaseEntity {
    filename: string
    path: string
    size: number
    mimeType: string
    type: 'client' | 'admin'
    order?: Order
    uploadedBy?: User
}

// API ответы
export interface ApiResponse<T> {
    data: T
    meta?: ApiMeta
}

export interface ApiMeta {
    pagination?: {
        page: number
        pageSize: number
        pageCount: number
        total: number
    }
}

export interface ApiError {
    status: number
    name: string
    message: string
    details: Record<string, unknown>
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

export interface AuthResponse {
    jwt: string
    user: User
    accessToken: string
}

// Типы для админки
export interface AdminUser extends User {
    role: Role & { type: 'admin' }
}

export interface DashboardStats {
    totalOrders: number
    activeOrders: number
    completedOrders: number
    totalRevenue: number
    ordersByStatus: Array<{
        status: string
        count: number
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
