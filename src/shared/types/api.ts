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
    name?: string
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
    history?: OrderHistory[]
}

export interface OrderHistory extends BaseEntity {
    action: string
    description?: string
    metadata?: Record<string, unknown>
    order?: Order
    user?: User
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
    order?: number
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
    type: 'client_material' | 'admin_file' | 'progress_screenshot'
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

export interface CreateAdminUserDto {
    email: string
    password: string
    name: string
    phone?: string
    role?: 'USER' | 'ADMIN'
}

export interface UpdateAdminUserDto {
    email?: string
    name?: string
    phone?: string
    role?: 'USER' | 'ADMIN'
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
    ordersToday: number
    ordersWeek: number
    ordersInWork: number
    ordersAwaitingPayment: number
    ordersCompleted: number
    recentOrders: Order[]
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

// Типы для таблиц
export interface TableColumn {
    key: string
    label: string
    sortable?: boolean
}
