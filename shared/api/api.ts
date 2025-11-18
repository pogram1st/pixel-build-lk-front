import axios, { AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: useRuntimeConfig().public.apiBase,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = useCookie('accessToken')
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { data } = await axios.post(
          `${useRuntimeConfig().public.apiBase}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        
        const accessToken = useCookie('accessToken')
        accessToken.value = data.accessToken

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await navigateTo('/auth/login')
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api

