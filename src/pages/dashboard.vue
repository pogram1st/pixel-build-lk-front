<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Дашборд</h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Активных заказов
                </h3>
                <p class="text-3xl font-bold text-primary-600">{{ activeOrders }}</p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Всего заказов
                </h3>
                <p class="text-3xl font-bold text-primary-600">{{ totalOrders }}</p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Последнее обновление
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ lastUpdate || 'Нет данных' }}
                </p>
            </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Последние заказы
                </h2>
            </div>
            <div class="p-6">
                <div v-if="!orders || orders.length === 0" class="text-center py-8 text-gray-500">
                    Нет заказов
                </div>
                <div v-else class="space-y-4">
                    <div
                        v-for="order in orders"
                        :key="order.id"
                        class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        @click="navigateTo(getOrderDetailPath(order.id))"
                    >
                        <div class="flex justify-between items-start">
                            <div>
                                <h3 class="font-medium text-gray-900 dark:text-gray-100">
                                    {{ order.service?.name }}
                                </h3>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    {{ new Date(order.createdAt).toLocaleDateString('ru-RU') }}
                                </p>
                            </div>
                            <span
                                class="px-3 py-1 rounded-full text-sm font-medium"
                                :style="{
                                    backgroundColor: order.status?.color + '20',
                                    color: order.status?.color,
                                }"
                            >
                                {{ order.status?.name }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Order } from '@shared/types/api'
    import { orderApi } from '@shared/api/orderApi'
    import { RouteNames } from '@shared/config/RouteNames'
    import { RoutePaths, getOrderDetailPath } from '@shared/config/RoutePaths'

    definePageMeta({
        layout: 'default',
    })

    const { data: orders } = await useAsyncData('orders', async () => {
        const data = await orderApi.getMyOrders()
        return data
    })

    const activeOrders = computed(() => {
        return orders.value?.filter(o => o.status?.name !== 'Завершен').length || 0
    })

    const totalOrders = computed(() => orders.value?.length || 0)

    const lastUpdate = computed(() => {
        if (!orders.value || orders.value.length === 0) return null
        const latest = orders.value.reduce(
            (latest: Order | null, order) => {
                if (!latest) return order
                return new Date(order.updatedAt) > new Date(latest.updatedAt) ? order : latest
            },
            null as Order | null
        )
        return latest ? new Date(latest.updatedAt).toLocaleString('ru-RU') : null
    })
</script>
