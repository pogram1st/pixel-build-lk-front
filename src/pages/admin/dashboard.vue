<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Дашборд</h1>
            <AppButton :to="RoutePaths[RouteNames.ADMIN_ORDERS] as string" variant="outline">
                Все заказы
            </AppButton>
        </div>

        <!-- Статистика -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Заказов сегодня
                </div>
                <div class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {{ stats?.ordersToday || 0 }}
                </div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Заказов за неделю
                </div>
                <div class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {{ stats?.ordersWeek || 0 }}
                </div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">В работе</div>
                <div class="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {{ stats?.ordersInWork || 0 }}
                </div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Ожидает оплаты
                </div>
                <div class="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {{ stats?.ordersAwaitingPayment || 0 }}
                </div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Завершено</div>
                <div class="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                    {{ stats?.ordersCompleted || 0 }}
                </div>
            </div>
        </div>

        <!-- Последние заказы -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Последние заказы
                </h2>
            </div>
            <div class="p-6">
                <div
                    v-if="!stats?.recentOrders || stats.recentOrders.length === 0"
                    class="text-center py-8 text-gray-500"
                >
                    Нет заказов
                </div>
                <div v-else class="space-y-4">
                    <div
                        v-for="order in stats.recentOrders"
                        :key="order.id"
                        class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                        <div class="flex-1">
                            <div class="flex items-center space-x-4">
                                <div>
                                    <div class="font-semibold text-gray-900 dark:text-white">
                                        Заказ #{{ order.id }}
                                    </div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400">
                                        {{ order.user?.name }} ({{ order.user?.email }})
                                    </div>
                                </div>
                                <div
                                    v-if="order.service"
                                    class="text-sm text-gray-600 dark:text-gray-300"
                                >
                                    {{ order.service.name }}
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4">
                            <span
                                v-if="order.status"
                                class="px-3 py-1 rounded-full text-sm font-medium"
                                :style="{
                                    backgroundColor: order.status.color + '20',
                                    color: order.status.color,
                                }"
                            >
                                {{ order.status.name }}
                            </span>
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                {{ new Date(order.createdAt).toLocaleDateString('ru-RU') }}
                            </div>
                            <NuxtLink
                                :to="getAdminOrderDetailPath(order.id)"
                                class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
                            >
                                Открыть →
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { adminApi } from '@shared/api/adminApi'
    import { RouteNames } from '@shared/config/RouteNames'
    import { RoutePaths, getAdminOrderDetailPath } from '@shared/config/RoutePaths'
    import AppButton from '@shared/ui/button/AppButton.vue'
    import type { DashboardStats } from '@shared/types/api'

    definePageMeta({
        layout: 'admin',
    })

    const { data: stats } = await useAsyncData<DashboardStats>('admin-dashboard-stats', async () => {
        const data = await adminApi.dashboard.getStats()
        return data
    })
</script>
