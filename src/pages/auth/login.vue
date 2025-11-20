<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2
                    class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100"
                >
                    Вход в личный кабинет
                </h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent.stop="handleSubmit">
                <div class="space-y-4">
                    <AppInput
                        v-model="formData.email"
                        type="email"
                        label="Email"
                        placeholder="email@example.com"
                        :error="errors.email"
                        required
                        @blur="validateField('email')"
                    />
                    <AppInput
                        v-model="formData.password"
                        type="password"
                        label="Пароль"
                        placeholder="Введите пароль"
                        :error="errors.password"
                        required
                        @blur="validateField('password')"
                    />
                </div>

                <div>
                    <AppButton type="submit" :disabled="loading" class="w-full">
                        {{ loading ? 'Вход...' : 'Войти' }}
                    </AppButton>
                </div>

                <div class="text-center">
                    <NuxtLink
                        :to="RoutePaths[RouteNames.AUTH_REGISTER] as string"
                        class="text-sm text-primary-600 hover:text-primary-500"
                    >
                        Нет аккаунта? Зарегистрироваться
                    </NuxtLink>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { reactive } from 'vue'
    import { useAuthStore } from '@features/auth/model/useAuthStore'
    import * as authApi from '@shared/api/authApi'
    import { RouteNames } from '@shared/config/RouteNames'
    import { RoutePaths } from '@shared/config/RoutePaths'
    import { useToast } from '@shared/lib/useToast'
    import { loginSchema } from '@shared/lib/validation'
    import AppInput from '@shared/ui/input/AppInput.vue'
    import AppButton from '@shared/ui/button/AppButton.vue'

    definePageMeta({
        layout: false,
    })

    const authStore = useAuthStore()
    const router = useRouter()
    const toast = useToast()

    const formData = reactive({
        email: '',
        password: '',
    })

    const errors = reactive<Record<string, string>>({})
    const loading = ref(false)

    const validateField = async (fieldName: keyof typeof formData) => {
        try {
            await loginSchema.validateAt(fieldName, formData)
            delete errors[fieldName]
        } catch (error: unknown) {
            const validationError = error as { path?: string; message: string }
            if (validationError.path) {
                errors[validationError.path] = validationError.message
            }
        }
    }

    const validateForm = async (): Promise<boolean> => {
        try {
            await loginSchema.validate(formData, { abortEarly: false })
            Object.keys(errors).forEach(key => delete errors[key])
            return true
        } catch (error: unknown) {
            const validationError = error as { inner?: { path?: string; message: string }[] }
            if (validationError.inner) {
                validationError.inner.forEach((err: { path?: string; message: string }) => {
                    if (err.path) {
                        errors[err.path] = err.message
                    }
                })
            }
            return false
        }
    }

    const handleSubmit = async (event?: Event) => {
        if (event) {
            event.preventDefault()
            event.stopPropagation()
        }

        const isValid = await validateForm()
        if (!isValid) {
            toast.error('Пожалуйста, исправьте ошибки в форме')
            return false
        }

        if (loading.value) {
            return false
        }

        loading.value = true
        try {
            const data = await authApi.authApi.login({
                email: formData.email,
                password: formData.password,
            })

            // Сохраняем в store
            authStore.setAuth(data)

            toast.showSuccess('Успешный вход!')

            // Принудительно обновляем страницу чтобы server middleware увидел куку
            const redirectTo = authStore.isAdmin
                ? RoutePaths[RouteNames.ADMIN_DASHBOARD]
                : RoutePaths[RouteNames.DASHBOARD]
            window.location.href = redirectTo as string
        } catch (error: unknown) {
            console.error('Login error:', error) // Отладка
            toast.showError(error, 'login')
        } finally {
            loading.value = false
        }

        return false
    }
</script>
