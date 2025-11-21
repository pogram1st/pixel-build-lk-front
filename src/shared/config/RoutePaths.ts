import { RouteNames } from './RouteNames'

export const RoutePaths: Record<
    (typeof RouteNames)[keyof typeof RouteNames],
    string | ((id: number | string) => string)
> = {
    // Удалены AUTH_LOGIN и AUTH_REGISTER - теперь используется централизованный auth-frontend
    [RouteNames.DASHBOARD]: '/dashboard',
    [RouteNames.ORDERS]: '/orders',
    [RouteNames.ORDER_DETAIL]: (id: number | string) => `/orders/${id}`,
    [RouteNames.PROFILE]: '/profile',
    [RouteNames.ADMIN_DASHBOARD]: '/admin/dashboard',
    [RouteNames.ADMIN_ORDERS]: '/admin/orders',
    [RouteNames.ADMIN_ORDER_CREATE]: '/admin/orders/create',
    [RouteNames.ADMIN_ORDER_DETAIL]: (id: number | string) => `/admin/orders/${id}`,
    [RouteNames.ADMIN_USERS]: '/admin/users',
    [RouteNames.ADMIN_SERVICES]: '/admin/services',
    [RouteNames.ADMIN_STATUSES]: '/admin/statuses',
} as const

export function getOrderDetailPath(id: number | string): string {
    const path = RoutePaths[RouteNames.ORDER_DETAIL]
    return typeof path === 'function' ? path(id) : ''
}

export function getAdminOrderDetailPath(id: number | string): string {
    const path = RoutePaths[RouteNames.ADMIN_ORDER_DETAIL]
    return typeof path === 'function' ? path(id) : ''
}
