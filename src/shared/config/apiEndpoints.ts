export const ApiEndpoints = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    ME: '/user/me',
    UPDATE: '/user/update',
  },
  ORDERS: {
    MY: '/orders/my',
    BY_ID: (id: number | string) => `/orders/${id}`,
    CREATE: '/orders',
  },
  ADMIN: {
    SERVICES: {
      ALL: '/admin/services',
      BY_ID: (id: number | string) => `/admin/services/${id}`,
    },
    STATUSES: {
      ALL: '/admin/statuses',
      BY_ID: (id: number | string) => `/admin/statuses/${id}`,
    },
    USERS: {
      ALL: '/admin/users',
      BY_ID: (id: number | string) => `/admin/users/${id}`,
    },
    ORDERS: {
      ALL: '/admin/orders',
      BY_ID: (id: number | string) => `/admin/orders/${id}`,
      UPDATE_STATUS: (id: number | string) => `/admin/orders/${id}/status`,
    },
    COMMENTS: {
      CREATE: '/admin/comments',
    },
  },
} as const

