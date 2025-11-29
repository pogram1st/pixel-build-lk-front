export const ApiEndpoints = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        RESET_PASSWORD: '/auth/reset-password',
        ME: '/auth/me',
        VERIFY: '/auth/verify',
        LOGOUT: '/auth/logout',
    },
    USER: {
        ME: '/users/me',
        UPDATE: (id: number | string) => `/users/${id}`,
    },
    ORDERS: {
        MY: '/orders/my',
        BY_ID: (id: number | string) => `/orders/${id}`,
        CREATE: '/orders',
    },
    BOTS: {
        ALL: '/bots',
        BY_ID: (id: number | string) => `/bots/${id}`,
        CREATE: '/bots',
        UPDATE: (id: number | string) => `/bots/${id}`,
        DELETE: (id: number | string) => `/bots/${id}`,
        START: (id: number | string) => `/bots/${id}/start`,
        STOP: (id: number | string) => `/bots/${id}/stop`,
        RESTART: (id: number | string) => `/bots/${id}/restart`,
        STATUS: (id: number | string) => `/bots/${id}/status`,
        WEBHOOK: (id: number | string) => `/bots/${id}/webhook`,
    },
    ADMIN: {
        SERVICES: {
            ALL: '/services',
            BY_ID: (id: number | string) => `/services/${id}`,
        },
        STATUSES: {
            ALL: '/statuses',
            BY_ID: (id: number | string) => `/statuses/${id}`,
        },
        USERS: {
            ALL: '/admin/users',
            BY_ID: (id: number | string) => `/users/${id}`,
        },
        ORDERS: {
            ALL: '/admin/orders',
            BY_ID: (id: number | string) => `/admin/orders/${id}`,
            CREATE: '/admin/orders',
            UPDATE: (id: number | string) => `/admin/orders/${id}`,
            UPDATE_STATUS: (id: number | string) => `/admin/orders/${id}/status`,
            UPLOAD_FILE: (id: number | string) => `/admin/orders/${id}/files`,
            DELETE_FILE: (orderId: number | string, fileId: number | string) =>
                `/admin/orders/${orderId}/files/${fileId}`,
        },
        DASHBOARD: {
            STATS: '/admin/dashboard',
        },
        COMMENTS: {
            CREATE: (orderId: number | string) => `/orders/${orderId}/comments`,
        },
    },
} as const
