<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div v-if="order" class="space-y-6">
            <div class="flex justify-between items-start">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Заказ #{{ order.id }}
                    </h1>
                    <p class="text-gray-500 dark:text-gray-400 mt-2">
                        Создан: {{ new Date(order.createdAt).toLocaleString('ru-RU') }}
                    </p>
                </div>
                <span
                    class="px-4 py-2 rounded-full text-sm font-medium"
                    :style="{
                        backgroundColor: order.status?.color + '20',
                        color: order.status?.color,
                    }"
                >
                    {{ order.status?.name }}
                </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold mb-4">Информация о заказе</h2>
                    <div class="space-y-3">
                        <div>
                            <span class="text-gray-500 dark:text-gray-400">Услуга:</span>
                            <span class="ml-2 font-medium">{{ order.service?.name }}</span>
                        </div>
                        <div v-if="order.service?.price">
                            <span class="text-gray-500 dark:text-gray-400">Цена:</span>
                            <span class="ml-2 font-medium">{{ order.service.price }} ₽</span>
                        </div>
                        <div>
                            <span class="text-gray-500 dark:text-gray-400">Обновлен:</span>
                            <span class="ml-2 font-medium">{{
                                new Date(order.updatedAt).toLocaleString('ru-RU')
                            }}</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold mb-4">Комментарии</h2>
                    <div class="space-y-4 max-h-96 overflow-y-auto">
                        <div
                            v-for="comment in order.comments"
                            :key="comment.id"
                            class="border-b border-gray-200 dark:border-gray-700 pb-3"
                        >
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                {{ new Date(comment.createdAt).toLocaleString('ru-RU') }}
                            </p>
                            <p class="text-gray-900 dark:text-gray-100">{{ comment.content }}</p>
                        </div>
                        <div
                            v-if="!order.comments || order.comments.length === 0"
                            class="text-gray-500"
                        >
                            Нет комментариев
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { orderApi } from '@shared/api/orderApi'

    definePageMeta({
        layout: 'default',
    })

    const route = useRoute()
    const orderId = Number(route.params.id)

    const { data: order } = await useAsyncData(`order-${orderId}`, async () => {
        const data = await orderApi.getOrder(orderId)
        return data
    })
</script>
