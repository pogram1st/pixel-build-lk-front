import { ref, reactive } from 'vue'
import { useToast } from './useToast'
import type { ErrorContext } from './errorHandler'

export interface FormField {
    value: string
    error: string
    required?: boolean
    validator?: (value: string) => string | null
}

export interface FormConfig<T extends Record<string, any>> {
    fields: T
    onSubmit: (data: Record<keyof T, string>) => Promise<void>
    errorContext?: ErrorContext
}

export function useForm<T extends Record<string, FormField>>(config: FormConfig<T>) {
    const { showError, showSuccess } = useToast()
    const isLoading = ref(false)
    const fields = reactive(config.fields)

    const validateField = (fieldName: keyof T) => {
        const field = fields[fieldName]

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
        for (const fieldName in fields) {
            fields[fieldName].error = ''
        }
    }

    const reset = () => {
        for (const fieldName in fields) {
            fields[fieldName].value = ''
            fields[fieldName].error = ''
        }
    }

    const getFormData = () => {
        const data: Record<keyof T, string> = {} as any
        for (const fieldName in fields) {
            data[fieldName] = fields[fieldName].value
        }
        return data
    }

    const handleSubmit = async () => {
        if (!validateAll()) {
            return
        }

        isLoading.value = true
        try {
            await config.onSubmit(getFormData())
            showSuccess('Операция выполнена успешно')
        } catch (error) {
            showError(error, config.errorContext)
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
