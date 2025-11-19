export const RouteNames = {
  AUTH_LOGIN: 'auth-login',
  AUTH_REGISTER: 'auth-register',
  DASHBOARD: 'dashboard',
  ORDERS: 'orders',
  ORDER_DETAIL: 'order-detail',
  PROFILE: 'profile',
  ADMIN_DASHBOARD: 'admin-dashboard',
  ADMIN_SETUP: 'admin-setup',
  ADMIN_ORDERS: 'admin-orders',
  ADMIN_ORDER_CREATE: 'admin-order-create',
  ADMIN_ORDER_DETAIL: 'admin-order-detail',
  ADMIN_USERS: 'admin-users',
  ADMIN_SERVICES: 'admin-services',
  ADMIN_STATUSES: 'admin-statuses',
} as const

export type RouteName = typeof RouteNames[keyof typeof RouteNames]

