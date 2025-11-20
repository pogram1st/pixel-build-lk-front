import { useAuthStore } from '@features/auth/model/useAuthStore'

export default defineNuxtPlugin(async () => {
    // Инициализация только на клиенте, чтобы избежать проблем с SSR
    if (process.client) {
        const authStore = useAuthStore()

        if (!authStore.isAuthenticated) {
            await authStore.initialize()
        }
    }
})
