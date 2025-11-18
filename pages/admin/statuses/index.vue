<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Управление статусами
      </h1>
      <AppButton @click="showCreateModal = true">
        Создать статус
      </AppButton>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6">
        <div v-if="loading" class="text-center py-8">
          Загрузка...
        </div>
        <AppTable
          v-else
          :columns="columns"
          :data="statuses"
        >
          <template #cell-color="{ value }">
            <div class="flex items-center space-x-2">
              <div
                class="w-6 h-6 rounded-full border border-gray-300"
                :style="{ backgroundColor: value }"
              />
              <span>{{ value }}</span>
            </div>
          </template>
          <template #cell-actions="{ row }">
            <div class="flex space-x-2">
              <button
                @click="editStatus(row)"
                class="text-primary-600 hover:text-primary-800"
              >
                Редактировать
              </button>
              <button
                @click="deleteStatus(row.id)"
                class="text-red-600 hover:text-red-800"
              >
                Удалить
              </button>
            </div>
          </template>
        </AppTable>
      </div>
    </div>

    <AppModal v-model="showCreateModal" title="Создать статус">
      <div class="space-y-4">
        <AppInput
          v-model="statusForm.name"
          label="Название"
          placeholder="Название статуса"
        />
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Цвет
          </label>
          <input
            v-model="statusForm.color"
            type="color"
            class="w-full h-10 border border-gray-300 rounded-md"
          />
        </div>
        <AppInput
          v-model="statusForm.order"
          type="number"
          label="Порядок"
          placeholder="0"
        />
      </div>
      <template #footer>
        <AppButton variant="outline" @click="showCreateModal = false">
          Отмена
        </AppButton>
        <AppButton @click="createStatus">
          Создать
        </AppButton>
      </template>
    </AppModal>

    <AppModal v-model="showEditModal" title="Редактировать статус">
      <div class="space-y-4">
        <AppInput
          v-model="editForm.name"
          label="Название"
          placeholder="Название статуса"
        />
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Цвет
          </label>
          <input
            v-model="editForm.color"
            type="color"
            class="w-full h-10 border border-gray-300 rounded-md"
          />
        </div>
        <AppInput
          v-model="editForm.order"
          type="number"
          label="Порядок"
          placeholder="0"
        />
      </div>
      <template #footer>
        <AppButton variant="outline" @click="showEditModal = false">
          Отмена
        </AppButton>
        <AppButton @click="updateStatus">
          Сохранить
        </AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { data: statuses, pending: loading, refresh } = await useLazyAsyncData('admin-statuses', async () => {
  const api = await import('~/shared/api/api')
  const { data } = await api.default.get('/admin/statuses')
  return data
})

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Название' },
  { key: 'color', label: 'Цвет' },
  { key: 'order', label: 'Порядок' },
  { key: 'actions', label: 'Действия' }
]

const showCreateModal = ref(false)
const showEditModal = ref(false)
const statusForm = ref({
  name: '',
  color: '#3b82f6',
  order: 0
})
const editForm = ref({
  id: 0,
  name: '',
  color: '#3b82f6',
  order: 0
})

const createStatus = async () => {
  try {
    const api = await import('~/shared/api/api')
    await api.default.post('/admin/statuses', {
      ...statusForm.value,
      order: Number(statusForm.value.order)
    })
    showCreateModal.value = false
    statusForm.value = { name: '', color: '#3b82f6', order: 0 }
    await refresh()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Ошибка создания статуса')
  }
}

const editStatus = (status: any) => {
  editForm.value = { ...status }
  showEditModal.value = true
}

const updateStatus = async () => {
  try {
    const api = await import('~/shared/api/api')
    await api.default.put(`/admin/statuses/${editForm.value.id}`, {
      ...editForm.value,
      order: Number(editForm.value.order)
    })
    showEditModal.value = false
    await refresh()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Ошибка обновления статуса')
  }
}

const deleteStatus = async (id: number) => {
  if (!confirm('Вы уверены, что хотите удалить этот статус?')) return
  try {
    const api = await import('~/shared/api/api')
    await api.default.delete(`/admin/statuses/${id}`)
    await refresh()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Ошибка удаления статуса')
  }
}
</script>

