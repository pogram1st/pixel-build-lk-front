import { useToast as useVueToastification } from 'vue-toastification'
import { getErrorMessage, type ErrorContext } from './errorHandler'

export function useToast() {
    const toast = useVueToastification()

    const showSuccess = (message: string) => {
        toast.success(message)
    }

    const showError = (
        error: unknown,
        context: ErrorContext = 'general'
    ) => {
        const message = getErrorMessage(error, context)
        toast.error(message)
    }

    const showWarning = (message: string) => {
        toast.warning(message)
    }

    const showInfo = (message: string) => {
        toast.info(message)
    }

    return {
        showSuccess,
        showError,
        showWarning,
        showInfo,
    }
}
