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
      CREATE: '/admin/orders',
      UPDATE: (id: number | string) => `/admin/orders/${id}`,
      UPDATE_STATUS: (id: number | string) => `/admin/orders/${id}/status`,
      UPLOAD_FILE: (id: number | string) => `/admin/orders/${id}/files`,
      DELETE_FILE: (orderId: number | string, fileId: number | string) => `/admin/orders/${orderId}/files/${fileId}`,
    },
    DASHBOARD: {
      STATS: '/admin/dashboard/stats',
    },
    SETUP: {
      CHECK: '/admin/setup/check',
      CREATE_ADMIN: '/admin/setup/create-admin',
    },
    COMMENTS: {
      CREATE: '/admin/comments',
    },
  },
} as const

