<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Регистрация
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent.stop="handleSubmit">
        <div class="space-y-4">
          <AppInput
            v-model="formData.name"
            label="Имя"
            placeholder="Ваше имя"
            :error="errors.name"
            required
            @blur="validateField('name')"
          />
          <AppInput
            v-model="formData.email"
            type="email"
            label="Email"
            placeholder="email@example.com"
            :error="errors.email"
            required
            @blur="validateField('email')"
          />
          <AppInput
            v-model="formData.phone"
            label="Телефон (необязательно)"
            placeholder="+7 (999) 123-45-67"
            :error="errors.phone"
            :mask="phoneMask"
            @blur="validateField('phone')"
          />
          <AppInput
            v-model="formData.password"
            type="password"
            label="Пароль"
            placeholder="Минимум 6 символов"
            :error="errors.password"
            required
            @blur="validateField('password')"
          />
        </div>

        <div>
          <AppButton type="submit" :disabled="loading" class="w-full">
            {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </AppButton>
        </div>

        <div class="text-center">
          <NuxtLink :to="RoutePaths[RouteNames.AUTH_LOGIN] as string" class="text-sm text-primary-600 hover:text-primary-500">
            Уже есть аккаунт? Войти
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@features/auth/model/useAuthStore'
import { useAuth } from '@features/auth/lib/useAuth'
import { RouteNames } from '@shared/config/RouteNames'
import { RoutePaths } from '@shared/config/RoutePaths'
import { useToast } from '@shared/lib/useToast'
import { registerSchema } from '@shared/lib/validation'
import { phoneMask, normalizePhone } from '@shared/lib/masks'
import AppInput from '@shared/ui/input/AppInput.vue'
import AppButton from '@shared/ui/button/AppButton.vue'

definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const { saveAuth } = useAuth()
const router = useRouter()
const toast = useToast()

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  password: ''
})

const errors = reactive<Record<string, string>>({})
const loading = ref(false)

const validateField = async (fieldName: keyof typeof formData) => {
  try {
    await registerSchema.validateAt(fieldName, formData)
    delete errors[fieldName]
  } catch (validationError: any) {
    if (validationError.path) {
      errors[validationError.path] = validationError.message
    }
  }
}

const validateForm = async (): Promise<boolean> => {
  try {
    await registerSchema.validate(formData, { abortEarly: false })
    Object.keys(errors).forEach(key => delete errors[key])
    return true
  } catch (validationError: any) {
    if (validationError.inner) {
      validationError.inner.forEach((err: any) => {
        if (err.path) {
          errors[err.path] = err.message
        }
      })
    }
    return false
  }
}

const handleSubmit = async (event?: Event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  const isValid = await validateForm()
  if (!isValid) {
    toast.error('Пожалуйста, исправьте ошибки в форме')
    return false
  }

  if (loading.value) {
    return false
  }

  loading.value = true
  try {
    const { data } = await authStore.register(
      formData.email, 
      formData.password, 
      formData.name, 
      normalizePhone(formData.phone)
    )
    saveAuth(data.user, data.accessToken)
    toast.success('Регистрация прошла успешно!')
    await router.push(RoutePaths[RouteNames.DASHBOARD] as string)
  } catch (error: any) {
    toast.showError(error, 'Ошибка регистрации')
  } finally {
    loading.value = false
  }
  
  return false
}
</script>

