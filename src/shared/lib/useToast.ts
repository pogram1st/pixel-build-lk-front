import { useAlertStore } from '../stores/useAlertStore'

export const useToast = () => {
    const alertStore = useAlertStore()

    return {
        success: (message: string, description?: string) =>
            alertStore.success(message, description),
        error: (message: string, description?: string) => alertStore.error(message, description),
        warning: (message: string, description?: string) =>
            alertStore.warning(message, description),
        info: (message: string, description?: string) => alertStore.info(message, description),
        showSuccess: (message: string, description?: string) =>
            alertStore.success(message, description),
        showError: (message: string, description?: string) =>
            alertStore.error(message, description),
        showWarning: (message: string, description?: string) =>
            alertStore.warning(message, description),
        showInfo: (message: string, description?: string) => alertStore.info(message, description),
    }
}
