<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
      Управление заказами
    </h1>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6">
        <div v-if="loading" class="text-center py-8">
          Загрузка...
        </div>
        <AppTable
          v-else
          :columns="columns"
          :data="orders"
        >
          <template #cell-user="{ value }">
            {{ value?.name }} ({{ value?.email }})
          </template>
          <template #cell-service="{ value }">
            {{ value?.name }}
          </template>
          <template #cell-status="{ value }">
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
              :style="{ backgroundColor: value?.color + '20', color: value?.color }"
            >
              {{ value?.name }}
            </span>
          </template>
          <template #cell-createdAt="{ value }">
            {{ new Date(value).toLocaleDateString('ru-RU') }}
          </template>
          <template #cell-actions="{ row }">
            <div class="flex space-x-2">
              <NuxtLink
                :to="`/admin/orders/${row.id}`"
                class="text-primary-600 hover:text-primary-800"
              >
                Открыть
              </NuxtLink>
            </div>
          </template>
        </AppTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { data: orders, pending: loading } = await useLazyAsyncData('admin-orders', async () => {
  const api = await import('~/shared/api/api')
  const { data } = await api.default.get('/admin/orders')
  return data
})

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'user', label: 'Клиент' },
  { key: 'service', label: 'Услуга' },
  { key: 'status', label: 'Статус' },
  { key: 'createdAt', label: 'Дата создания' },
  { key: 'actions', label: 'Действия' }
]
</script>

