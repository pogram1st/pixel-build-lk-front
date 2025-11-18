<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Вход в личный кабинет
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <AppInput
            v-model="email"
            type="email"
            placeholder="Email"
            class="mb-4"
          />
          <AppInput
            v-model="password"
            type="password"
            placeholder="Пароль"
          />
        </div>

        <div>
          <AppButton type="submit" :disabled="loading" class="w-full">
            {{ loading ? 'Вход...' : 'Войти' }}
          </AppButton>
        </div>

        <div class="text-center">
          <NuxtLink to="/auth/register" class="text-sm text-primary-600 hover:text-primary-500">
            Нет аккаунта? Зарегистрироваться
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

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    const redirectTo = authStore.isAdmin ? '/admin/dashboard' : '/dashboard'
    await router.push(redirectTo)
  } catch (error: any) {
    alert(error.response?.data?.message || 'Ошибка входа')
  } finally {
    loading.value = false
  }
}
</script>

