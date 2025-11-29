import { defineStore } from 'pinia'
import { ref } from 'vue'

export type AlertVariant = 'success' | 'error' | 'warning' | 'info'

export interface AlertItem {
    id: number
    message: string
    description?: string
    variant: AlertVariant
}

export const useAlertStore = defineStore('alert', () => {
    const alerts = ref<AlertItem[]>([])

    const addAlert = (opts: {
        message: string
        description?: string
        variant?: AlertVariant
        timeout?: number
    }) => {
        const { message, description, variant = 'info', timeout = 5000 } = opts
        const id = Date.now()

        alerts.value.push({ id, message, description, variant })

        if (timeout) {
            setTimeout(() => removeAlert(id), timeout)
        }
    }

    const removeAlert = (id: number) => {
        alerts.value = alerts.value.filter(a => a.id !== id)
    }

    const success = (message: string, description?: string, timeout = 5000) =>
        addAlert({ message, description, variant: 'success', timeout })

    const error = (message: string, description?: string, timeout = 5000) =>
        addAlert({ message, description, variant: 'error', timeout })

    const warning = (message: string, description?: string, timeout = 5000) =>
        addAlert({ message, description, variant: 'warning', timeout })

    const info = (message: string, description?: string, timeout = 5000) =>
        addAlert({ message, description, variant: 'info', timeout })

    return {
        alerts,
        addAlert,
        removeAlert,
        success,
        error,
        warning,
        info,
    }
})
