<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Мои заказы
      </h1>
      <AppButton @click="showCreateModal = true">
        Создать заказ
      </AppButton>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6">
        <div v-if="!orders || orders.length === 0" class="text-center py-8 text-gray-500">
          Нет заказов
        </div>
        <AppTable
          v-else-if="orders"
          :columns="columns"
          :data="orders"
        >
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
            <NuxtLink
              :to="getOrderDetailPath(row.id)"
              class="text-primary-600 hover:text-primary-800"
            >
              Подробнее
            </NuxtLink>
          </template>
        </AppTable>
      </div>
    </div>

    <AppModal v-model="showCreateModal" title="Создать заказ">
      <div class="space-y-4">
        <AppInput
          v-model="newOrder.serviceId"
          type="number"
          label="ID услуги"
          placeholder="Введите ID услуги"
        />
      </div>
      <template #footer>
        <AppButton variant="outline" @click="showCreateModal = false">
          Отмена
        </AppButton>
        <AppButton @click="createOrder">
          Создать
        </AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { orderApi } from '@shared/api/orderApi'
import { RouteNames } from '@shared/config/RouteNames'
import { RoutePaths, getOrderDetailPath } from '@shared/config/RoutePaths'
import { useToast } from '@shared/lib/useToast'
import AppInput from '@shared/ui/input/AppInput.vue'
import AppButton from '@shared/ui/button/AppButton.vue'
import AppModal from '@shared/ui/modal/AppModal.vue'
import AppTable from '@shared/ui/table/AppTable.vue'

definePageMeta({
  layout: 'default'
})

const { data: orders, refresh } = await useAsyncData('my-orders', async () => {
  const { data } = await orderApi.getMyOrders()
  return data
})

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'service', label: 'Услуга' },
  { key: 'status', label: 'Статус' },
  { key: 'createdAt', label: 'Дата создания' },
  { key: 'actions', label: 'Действия' }
]

const showCreateModal = ref(false)
const newOrder = ref({ serviceId: '' })
const toast = useToast()

const createOrder = async () => {
  try {
    await orderApi.create({ serviceId: Number(newOrder.value.serviceId) })
    toast.success('Заказ успешно создан')
    showCreateModal.value = false
    newOrder.value = { serviceId: '' }
    await refresh()
  } catch (error: any) {
    toast.showError(error, 'Ошибка создания заказа')
  }
}
</script>

