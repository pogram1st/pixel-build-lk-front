<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Регистрация
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <AppInput
            v-model="name"
            label="Имя"
            placeholder="Ваше имя"
          />
          <AppInput
            v-model="email"
            type="email"
            label="Email"
            placeholder="email@example.com"
          />
          <AppInput
            v-model="phone"
            label="Телефон (необязательно)"
            placeholder="+7 (999) 123-45-67"
          />
          <AppInput
            v-model="password"
            type="password"
            label="Пароль"
            placeholder="Минимум 6 символов"
          />
        </div>

        <div>
          <AppButton type="submit" :disabled="loading" class="w-full">
            {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </AppButton>
        </div>

        <div class="text-center">
          <NuxtLink to="/auth/login" class="text-sm text-primary-600 hover:text-primary-500">
            Уже есть аккаунт? Войти
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  try {
    await authStore.register(email.value, password.value, name.value, phone.value || undefined)
    await router.push('/dashboard')
  } catch (error: any) {
    alert(error.response?.data?.message || 'Ошибка регистрации')
  } finally {
    loading.value = false
  }
}
</script>

