<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="text-center py-8">
      Загрузка...
    </div>
    <div v-else-if="order" class="space-y-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Заказ #{{ order.id }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-2">
            Создан: {{ new Date(order.createdAt).toLocaleString('ru-RU') }}
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <select
            v-model="selectedStatusId"
            class="px-4 py-2 border border-gray-300 rounded-md"
            @change="updateStatus"
          >
            <option v-for="status in statuses" :key="status.id" :value="status.id">
              {{ status.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Информация о заказе</h2>
          <div class="space-y-3">
            <div>
              <span class="text-gray-500 dark:text-gray-400">Клиент:</span>
              <span class="ml-2 font-medium">{{ order.user?.name }} ({{ order.user?.email }})</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Услуга:</span>
              <span class="ml-2 font-medium">{{ order.service?.name }}</span>
            </div>
            <div v-if="order.service?.price">
              <span class="text-gray-500 dark:text-gray-400">Цена:</span>
              <span class="ml-2 font-medium">{{ order.service.price }} ₽</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Статус:</span>
              <span
                class="ml-2 px-3 py-1 rounded-full text-sm font-medium"
                :style="{ backgroundColor: order.status?.color + '20', color: order.status?.color }"
              >
                {{ order.status?.name }}
              </span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Комментарии</h2>
          <div class="space-y-4 max-h-96 overflow-y-auto mb-4">
            <div
              v-for="comment in order.comments"
              :key="comment.id"
              class="border-b border-gray-200 dark:border-gray-700 pb-3"
            >
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {{ new Date(comment.createdAt).toLocaleString('ru-RU') }}
              </p>
              <p class="text-gray-900 dark:text-gray-100">{{ comment.text }}</p>
            </div>
            <div v-if="!order.comments || order.comments.length === 0" class="text-gray-500">
              Нет комментариев
            </div>
          </div>
          <div class="flex space-x-2">
            <input
              v-model="newComment"
              type="text"
              placeholder="Добавить комментарий"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              @keyup.enter="addComment"
            />
            <AppButton @click="addComment">Отправить</AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const route = useRoute()
const orderId = Number(route.params.id)

const { data: order, pending: loading, refresh } = await useLazyAsyncData(`admin-order-${orderId}`, async () => {
  const api = await import('~/shared/api/api')
  const { data } = await api.default.get(`/admin/orders/${orderId}`)
  return data
})

const { data: statuses } = await useLazyAsyncData('statuses', async () => {
  const api = await import('~/shared/api/api')
  const { data } = await api.default.get('/admin/statuses')
  return data
})

const selectedStatusId = ref(order.value?.statusId)
const newComment = ref('')

watch(order, (newOrder) => {
  if (newOrder) {
    selectedStatusId.value = newOrder.statusId
  }
}, { immediate: true })

const updateStatus = async () => {
  try {
    const api = await import('~/shared/api/api')
    await api.default.put(`/admin/orders/${orderId}/status`, { statusId: selectedStatusId.value })
    await refresh()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Ошибка обновления статуса')
  }
}

const addComment = async () => {
  if (!newComment.value.trim()) return
  try {
    const api = await import('~/shared/api/api')
    await api.default.post('/admin/comments', { orderId, text: newComment.value })
    newComment.value = ''
    await refresh()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Ошибка добавления комментария')
  }
}
</script>

