import { ref, reactive } from 'vue'
import { useToast } from './useToast'
import type { ErrorContext } from './errorHandler'

export interface FormField {
    value: string
    error: string
    required?: boolean
    validator?: (value: string) => string | null
}

export interface FormConfig<T extends Record<string, FormField>> {
    fields: T
    onSubmit: (data: Record<keyof T, string>) => Promise<void>
    errorContext?: ErrorContext
}

export function useForm<T extends Record<string, FormField>>(config: FormConfig<T>) {
    const { showError, showSuccess } = useToast()
    const isLoading = ref(false)
    const fields = reactive(config.fields)

    const validateField = (fieldName: keyof T) => {
        const field = (fields as unknown as Record<keyof T, FormField>)[fieldName]

        if (field.required && !field.value.trim()) {
            field.error = 'Это поле обязательно для заполнения'
            return false
        }

        if (field.validator) {
            const error = field.validator(field.value)
            field.error = error || ''
            return !error
        }

        field.error = ''
        return true
    }

    const validateAll = () => {
        let isValid = true
        for (const fieldName in fields) {
            if (!validateField(fieldName)) {
                isValid = false
            }
        }
        return isValid
    }

    const clearErrors = () => {
        const fieldsRecord = fields as unknown as Record<keyof T, FormField>
        for (const fieldName in fieldsRecord) {
            fieldsRecord[fieldName].error = ''
        }
    }

    const reset = () => {
        const fieldsRecord = fields as unknown as Record<keyof T, FormField>
        for (const fieldName in fieldsRecord) {
            fieldsRecord[fieldName].value = ''
            fieldsRecord[fieldName].error = ''
        }
    }

    const getFormData = (): Record<keyof T, string> => {
        const data: Partial<Record<keyof T, string>> = {}
        const fieldsRecord = fields as unknown as Record<keyof T, FormField>
        for (const fieldName in fieldsRecord) {
            const key = fieldName as keyof T
            const field = fieldsRecord[key]
            if (field) {
                data[key] = field.value
            }
        }
        return data as Record<keyof T, string>
    }

    const handleSubmit = async () => {
        if (!validateAll()) {
            return
        }

        isLoading.value = true
        try {
            await config.onSubmit(getFormData())
            showSuccess('Операция выполнена успешно')
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            showError(errorMessage, config.errorContext)
        } finally {
            isLoading.value = false
        }
    }

    return {
        fields,
        isLoading,
        validateField,
        validateAll,
        clearErrors,
        reset,
        getFormData,
        handleSubmit,
    }
}

// Валидаторы
export const validators = {
    email: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value) ? null : 'Неверный формат email'
    },

    phone: (value: string) => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/
        return phoneRegex.test(value.replace(/\s/g, '')) ? null : 'Неверный формат телефона'
    },

    password: (value: string) => {
        if (value.length < 6) {
            return 'Пароль должен содержать минимум 6 символов'
        }
        return null
    },

    required: (value: string) => {
        return value.trim() ? null : 'Это поле обязательно для заполнения'
    },

    minLength: (min: number) => (value: string) => {
        return value.length >= min ? null : `Минимум ${min} символов`
    },

    maxLength: (max: number) => (value: string) => {
        return value.length <= max ? null : `Максимум ${max} символов`
    },
}
