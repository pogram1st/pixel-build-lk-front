<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <nav class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/dashboard" class="text-xl font-bold text-primary-600">
              Pixel Build
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/orders" class="px-3 py-2 rounded-md text-sm font-medium">
              Заказы
            </NuxtLink>
            <NuxtLink to="/profile" class="px-3 py-2 rounded-md text-sm font-medium">
              Профиль
            </NuxtLink>
            <button
              @click="logout"
              class="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Выход
            </button>
          </div>
        </div>
      </div>
    </nav>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const authStore = useAuthStore()

const logout = async () => {
  authStore.logout()
  await router.push('/auth/login')
}
</script>

