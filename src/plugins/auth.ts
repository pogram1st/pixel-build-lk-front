import { useAuthStore } from '@features/auth/model/useAuthStore'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    await authStore.initialize()
  }
})

