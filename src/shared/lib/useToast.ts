import { useToast as useVueToastification } from 'vue-toastification'
import type { ToastOptions, ToastContent } from 'vue-toastification'
import { getErrorMessage, type ErrorContext } from './errorHandler'

export function useToast() {
    const toast = useVueToastification()

    const showSuccess = (message: ToastContent, options?: ToastOptions) => {
        toast.success(message, options)
    }

    const showError = (
        error: unknown,
        context: ErrorContext = 'general',
        options?: ToastOptions
    ) => {
        const message = getErrorMessage(error, context)
        toast.error(message, options)
    }

    const showWarning = (message: ToastContent, options?: ToastOptions) => {
        toast.warning(message, options)
    }

    const showInfo = (message: ToastContent, options?: ToastOptions) => {
        toast.info(message, options)
    }

    return {
        showSuccess,
        showError,
        showWarning,
        showInfo,
    }
}
