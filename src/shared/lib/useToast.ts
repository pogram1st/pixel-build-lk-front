import { useToast as useVueToastification } from 'vue-toastification'
import type { ToastOptions, ToastContent } from 'vue-toastification'

export function useToast() {
  const toast = useVueToastification()

  return {
    success: (message: ToastContent, options?: ToastOptions) => {
      return toast.success(message, {
        timeout: 3000,
        ...options,
      })
    },

    error: (message: ToastContent, options?: ToastOptions) => {
      return toast.error(message, {
        timeout: 4000,
        ...options,
      })
    },

    info: (message: ToastContent, options?: ToastOptions) => {
      return toast.info(message, {
        timeout: 3000,
        ...options,
      })
    },

    warning: (message: ToastContent, options?: ToastOptions) => {
      return toast.warning(message, {
        timeout: 3500,
        ...options,
      })
    },

    default: (message: ToastContent, options?: ToastOptions) => {
      return toast(message, options)
    },

    showError: (error: any, defaultMessage = 'Произошла ошибка') => {
      const message = error?.response?.data?.message || error?.message || defaultMessage
      return toast.error(message, {
        timeout: 4000,
      })
    },

    showSuccess: (message: string) => {
      return toast.success(message, {
        timeout: 3000,
      })
    },
  }
}

