<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Создать заказ</h1>
      <AppButton
        variant="outline"
        :to="RoutePaths[RouteNames.ADMIN_ORDERS] as string"
      >
        Назад к списку
      </AppButton>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
      <!-- Информация о клиенте -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Информация о клиенте</h2>
        
        <AppInput
          v-model="formData.clientName"
          label="Имя клиента *"
          placeholder="Введите имя клиента"
          required
          :error="errors.clientName"
        />
        
        <AppInput
          v-model="formData.clientEmail"
          type="email"
          label="Email клиента *"
          placeholder="client@example.com"
          required
          :error="errors.clientEmail"
        />
        
        <AppInput
          v-model="formData.telegram"
          label="Telegram"
          placeholder="@username"
          :error="errors.telegram"
        />
        
        <AppInput
          v-model="formData.whatsapp"
          label="WhatsApp"
          placeholder="+79991234567"
          :error="errors.whatsapp"
        />
      </div>

      <!-- Детали заказа -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Детали заказа</h2>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Описание заказа *
          </label>
          <textarea
            v-model="formData.description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Опишите детали заказа..."
            required
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
        </div>
        
        <AppInput
          v-model="formData.clientLink"
          label="Ссылка от клиента"
          placeholder="https://..."
          :error="errors.clientLink"
        />
        
        <div class="grid grid-cols-2 gap-4">
          <AppInput
            v-model.number="formData.amount"
            type="number"
            label="Сумма заказа (₽)"
            placeholder="0"
            :error="errors.amount"
          />
          
          <AppInput
            v-model="formData.paymentLink"
            label="Ссылка на оплату"
            placeholder="https://..."
            :error="errors.paymentLink"
          />
        </div>
      </div>

      <!-- Услуга и статус -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Услуга
          </label>
          <select
            v-model.number="formData.serviceId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option :value="undefined">Не выбрано</option>
            <option v-for="service in services" :key="service.id" :value="service.id">
              {{ service.name }} {{ service.price ? `(${service.price} ₽)` : '' }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Статус *
          </label>
          <select
            v-model.number="formData.statusId"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option :value="undefined">Выберите статус</option>
            <option v-for="status in statuses" :key="status.id" :value="status.id">
              {{ status.name }}
            </option>
          </select>
          <p v-if="errors.statusId" class="mt-1 text-sm text-red-600">{{ errors.statusId }}</p>
        </div>
      </div>

      <!-- Файлы -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Материалы от клиента</h2>
        <div>
          <input
            type="file"
            multiple
            @change="handleFileChange"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
          <p class="mt-1 text-sm text-gray-500">Можно загрузить несколько файлов</p>
        </div>
        <div v-if="selectedFiles.length > 0" class="space-y-2">
          <div
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
          >
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ file.name }}</span>
            <button
              type="button"
              @click="removeFile(index)"
              class="text-red-600 hover:text-red-800"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>

      <!-- Кнопки -->
      <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <AppButton
          type="button"
          variant="outline"
          :to="RoutePaths[RouteNames.ADMIN_ORDERS] as string"
        >
          Отмена
        </AppButton>
        <AppButton type="submit" :disabled="loading">
          {{ loading ? 'Создание...' : 'Создать заказ' }}
        </AppButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { adminApi } from '@shared/api/adminApi'
import { RouteNames } from '@shared/config/RouteNames'
import { RoutePaths } from '@shared/config/RoutePaths'
import { useToast } from '@shared/lib/useToast'
import AppInput from '@shared/ui/input/AppInput.vue'
import AppButton from '@shared/ui/button/AppButton.vue'

definePageMeta({
  layout: 'admin'
})

const router = useRouter()
const toast = useToast()

const { data: services } = await useAsyncData('admin-services', async () => {
  const { data } = await adminApi.services.getAll()
  return data
})

const { data: statuses } = await useAsyncData('admin-statuses', async () => {
  const { data } = await adminApi.statuses.getAll()
  return data
})

const formData = reactive({
  clientName: '',
  clientEmail: '',
  telegram: '',
  whatsapp: '',
  description: '',
  clientLink: '',
  amount: undefined as number | undefined,
  paymentLink: '',
  serviceId: undefined as number | undefined,
  statusId: undefined as number | undefined,
})

const errors = reactive<Record<string, string>>({})
const loading = ref(false)
const selectedFiles = ref<File[]>([])

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    selectedFiles.value = Array.from(target.files)
  }
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const handleSubmit = async () => {
  // Валидация
  Object.keys(errors).forEach(key => delete errors[key])
  
  if (!formData.clientName) {
    errors.clientName = 'Имя клиента обязательно'
  }
  if (!formData.clientEmail) {
    errors.clientEmail = 'Email клиента обязателен'
  }
  if (!formData.description) {
    errors.description = 'Описание заказа обязательно'
  }
  if (!formData.statusId) {
    errors.statusId = 'Статус обязателен'
  }
  
  if (Object.keys(errors).length > 0) {
    toast.error('Пожалуйста, заполните все обязательные поля')
    return
  }

  loading.value = true
  try {
    await adminApi.orders.create({
      ...formData,
      files: selectedFiles.value,
    })
    toast.success('Заказ успешно создан')
    await router.push(RoutePaths[RouteNames.ADMIN_ORDERS] as string)
  } catch (error: any) {
    toast.showError(error, 'Ошибка создания заказа')
  } finally {
    loading.value = false
  }
}
</script>

