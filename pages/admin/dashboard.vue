<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
      Админ панель - Дашборд
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Всего заказов
        </h3>
        <p class="text-3xl font-bold text-primary-600">{{ stats.totalOrders }}</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Активных заказов
        </h3>
        <p class="text-3xl font-bold text-primary-600">{{ stats.activeOrders }}</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Пользователей
        </h3>
        <p class="text-3xl font-bold text-primary-600">{{ stats.totalUsers }}</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Новых за неделю
        </h3>
        <p class="text-3xl font-bold text-primary-600">{{ stats.newOrdersWeek }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { data: stats } = await useLazyAsyncData('admin-stats', async () => {
  // TODO: Implement admin stats endpoint
  return {
    totalOrders: 0,
    activeOrders: 0,
    totalUsers: 0,
    newOrdersWeek: 0
  }
})
</script>

