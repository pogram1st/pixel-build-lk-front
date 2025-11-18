<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (authStore.isAuthenticated) {
    const redirectTo = authStore.isAdmin ? '/admin/dashboard' : '/dashboard'
    router.push(redirectTo)
  } else {
    router.push('/auth/login')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="text-gray-500">Загрузка...</p>
    </div>
  </div>
</template>

