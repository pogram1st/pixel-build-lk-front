import * as yup from 'yup'

export const emailSchema = yup
    .string()
    .email('Введите корректный email адрес')
    .required('Email обязателен для заполнения')

export const passwordSchema = yup
    .string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .required('Пароль обязателен для заполнения')

export const nameSchema = yup
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .required('Имя обязательно для заполнения')

export const phoneSchema = yup
    .string()
    .test('phone', 'Введите корректный номер телефона в формате +7 (999) 123-45-67', value => {
        if (!value || value.trim() === '') return true
        const cleaned = value.replace(/\D/g, '')
        const normalized = cleaned.startsWith('8') ? '7' + cleaned.slice(1) : cleaned
        return normalized.length >= 11 && normalized.startsWith('7')
    })
    .optional()
    .nullable()
    .transform(value => (value === '' ? undefined : value))

export const loginSchema = yup.object({
    email: emailSchema,
    password: passwordSchema,
})

export const registerSchema = yup.object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
})

export const numberSchema = yup
    .number()
    .positive('Число должно быть положительным')
    .integer('Число должно быть целым')
    .required('Поле обязательно для заполнения')

export const requiredSchema = (message = 'Поле обязательно для заполнения') => {
    return yup.string().required(message)
}
