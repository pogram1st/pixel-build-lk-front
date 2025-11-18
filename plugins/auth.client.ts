export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const tokenCookie = useCookie('accessToken')
  
  // Try to restore auth state from cookie
  if (tokenCookie.value && !authStore.isAuthenticated) {
    try {
      const api = await import('~/shared/api/api')
      const { data } = await api.default.get('/user/me')
      authStore.setAuth({
        accessToken: tokenCookie.value,
        user: data
      })
    } catch (error) {
      // Token invalid, clear it
      tokenCookie.value = null
    }
  }
})

