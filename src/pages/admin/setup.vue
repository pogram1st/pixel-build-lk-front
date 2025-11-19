<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-2xl">PB</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Настройка системы
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">
          Создайте первого администратора
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Имя администратора *
          </label>
          <AppInput
            v-model="formData.name"
            placeholder="Введите имя"
            required
            :error="errors.name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <AppInput
            v-model="formData.email"
            type="email"
            placeholder="admin@example.com"
            required
            :error="errors.email"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Пароль *
          </label>
          <AppInput
            v-model="formData.password"
            type="password"
            placeholder="Минимум 6 символов"
            required
            :error="errors.password"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Подтвердите пароль *
          </label>
          <AppInput
            v-model="formData.passwordConfirm"
            type="password"
            placeholder="Повторите пароль"
            required
            :error="errors.passwordConfirm"
          />
        </div>

        <AppButton type="submit" :disabled="loading" class="w-full">
          {{ loading ? 'Создание...' : 'Создать администратора' }}
        </AppButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { adminApi } from '@shared/api/adminApi'
import { authApi } from '@shared/api/authApi'
import { useAuthStore } from '@features/auth/model/useAuthStore'
import { useAuth } from '@features/auth/lib/useAuth'
import { RouteNames } from '@shared/config/RouteNames'
import { RoutePaths } from '@shared/config/RoutePaths'
import { useToast } from '@shared/lib/useToast'
import AppInput from '@shared/ui/input/AppInput.vue'
import AppButton from '@shared/ui/button/AppButton.vue'

definePageMeta({
  layout: false
})

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const { saveAuth } = useAuth()

const formData = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
})

const errors = reactive<Record<string, string>>({})
const loading = ref(false)

const handleSubmit = async () => {
  // Валидация
  Object.keys(errors).forEach(key => delete errors[key])
  
  if (!formData.name.trim()) {
    errors.name = 'Имя обязательно'
  }
  if (!formData.email.trim()) {
    errors.email = 'Email обязателен'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Некорректный email'
  }
  if (!formData.password) {
    errors.password = 'Пароль обязателен'
  } else if (formData.password.length < 6) {
    errors.password = 'Пароль должен быть не менее 6 символов'
  }
  if (!formData.passwordConfirm) {
    errors.passwordConfirm = 'Подтверждение пароля обязательно'
  } else if (formData.password !== formData.passwordConfirm) {
    errors.passwordConfirm = 'Пароли не совпадают'
  }
  
  if (Object.keys(errors).length > 0) {
    toast.error('Пожалуйста, исправьте ошибки в форме')
    return
  }

  loading.value = true
  try {
    // Создать первого админа
    await adminApi.setup.createFirstAdmin({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    })
    
    // Автоматически войти
    const { data } = await authStore.login(formData.email, formData.password)
    saveAuth(data.user, data.accessToken)
    
    toast.success('Администратор создан! Добро пожаловать!')
    await router.push(RoutePaths[RouteNames.ADMIN_DASHBOARD] as string)
  } catch (error: any) {
    toast.showError(error, 'Ошибка создания администратора')
  } finally {
    loading.value = false
  }
}
</script>

