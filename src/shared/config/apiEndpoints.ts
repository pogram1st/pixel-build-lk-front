export const ApiEndpoints = {
    AUTH: {
        LOGIN: '/api/auth/local',
        REGISTER: '/api/auth/local/register', // Используем стандартный Strapi endpoint
        REFRESH: '/api/auth/refresh', // Strapi не имеет встроенного refresh, можно реализовать отдельно
        RESET_PASSWORD: '/api/auth/forgot-password',
        ME: '/api/users/me',
    },
    USER: {
        ME: '/api/users/me',
        UPDATE: (id: number | string) => `/api/users/${id}`,
    },
    ORDERS: {
        MY: '/api/orders/my-orders',
        BY_ID: (id: number | string) => `/api/orders/${id}`,
        CREATE: '/api/orders',
    },
    ADMIN: {
        SERVICES: {
            ALL: '/api/services',
            BY_ID: (id: number | string) => `/api/services/${id}`,
        },
        STATUSES: {
            ALL: '/api/statuses',
            BY_ID: (id: number | string) => `/api/statuses/${id}`,
        },
        USERS: {
            ALL: '/api/admin/users',
            BY_ID: (id: number | string) => `/api/users/${id}`,
        },
        ORDERS: {
            ALL: '/api/admin/orders',
            BY_ID: (id: number | string) => `/api/admin/orders/${id}`,
            CREATE: '/api/admin/orders',
            UPDATE: (id: number | string) => `/api/admin/orders/${id}`,
            UPDATE_STATUS: (id: number | string) => `/api/admin/orders/${id}/status`,
            UPLOAD_FILE: (id: number | string) => `/api/admin/orders/${id}/files`,
            DELETE_FILE: (orderId: number | string, fileId: number | string) =>
                `/api/admin/orders/${orderId}/files/${fileId}`,
        },
        DASHBOARD: {
            STATS: '/api/admin/dashboard/stats',
        },
        COMMENTS: {
            CREATE: '/api/comments',
        },
    },
} as const
