import { useAlertStore } from '../stores/useAlertStore'
import { getErrorMessage, type ErrorContext } from './errorHandler'

export function useAlert() {
    const alertStore = useAlertStore()

    const showSuccess = (message: string, description?: string) => {
        alertStore.success(message, description)
    }

    const showError = (error: unknown, context: ErrorContext = 'general', description?: string) => {
        const message = getErrorMessage(error, context)
        alertStore.error(message, description)
    }

    const showWarning = (message: string, description?: string) => {
        alertStore.warning(message, description)
    }

    const showInfo = (message: string, description?: string) => {
        alertStore.info(message, description)
    }

    return {
        showSuccess,
        showError,
        showWarning,
        showInfo,
        // Для обратной совместимости
        success: showSuccess,
        error: showError,
        warning: showWarning,
        info: showInfo,
    }
}
