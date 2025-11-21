<template>
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Профиль</h1>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
            <form @submit.prevent="updateProfile">
                <h2 class="text-xl font-semibold mb-4">Личная информация</h2>
                <div class="space-y-4">
                    <AppInput 
                        v-model="userData.name" 
                        label="Имя" 
                        placeholder="Ваше имя"
                        :error="errors.name"
                        required
                        @blur="validateField('name')"
                    />
                    <AppInput
                        v-model="userData.email"
                        type="email"
                        label="Email"
                        placeholder="email@example.com"
                        :error="errors.email"
                        disabled
                    />
                    <AppInput
                        v-model="userData.phone"
                        label="Телефон (необязательно)"
                        placeholder="+7 (999) 123-45-67"
                        :error="errors.phone"
                        :mask="phoneMask"
                        @blur="validateField('phone')"
                    />
                </div>
                <div class="mt-4">
                    <AppButton type="submit" :disabled="profileLoading">
                        {{ profileLoading ? 'Сохранение...' : 'Сохранить изменения' }}
                    </AppButton>
                </div>
            </form>

            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                <form @submit.prevent="changePassword">
                    <h2 class="text-xl font-semibold mb-4">Смена пароля</h2>
                    <div class="space-y-4">
                        <AppInput
                            v-model="passwordData.currentPassword"
                            type="password"
                            label="Текущий пароль"
                            placeholder="Введите текущий пароль"
                            :error="passwordErrors.currentPassword"
                            required
                            @blur="validatePasswordField('currentPassword')"
                        />
                        <AppInput
                            v-model="passwordData.newPassword"
                            type="password"
                            label="Новый пароль"
                            placeholder="Введите новый пароль (минимум 6 символов)"
                            :error="passwordErrors.newPassword"
                            required
                            @blur="validatePasswordField('newPassword')"
                        />
                        <AppInput
                            v-model="passwordData.confirmPassword"
                            type="password"
                            label="Подтвердите пароль"
                            placeholder="Повторите новый пароль"
                            :error="passwordErrors.confirmPassword"
                            required
                            @blur="validatePasswordField('confirmPassword')"
                        />
                    </div>
                    <div class="mt-4">
                        <AppButton type="submit" :disabled="passwordLoading">
                            {{ passwordLoading ? 'Изменение...' : 'Изменить пароль' }}
                        </AppButton>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useAuthStore } from '@features/auth/model/useAuthStore'
    import { userApi } from '@shared/api/userApi'
    import { useToast } from '@shared/lib/useToast'
    import { nameSchema, phoneSchema, passwordSchema } from '@shared/lib/validation'
    import { phoneMask, normalizePhone } from '@shared/lib/masks'
    import AppInput from '@shared/ui/input/AppInput.vue'
    import AppButton from '@shared/ui/button/AppButton.vue'
    import * as yup from 'yup'

    definePageMeta({
        layout: 'default',
    })

    const authStore = useAuthStore()
    const toast = useToast()

    const { data: user } = await useAsyncData('user-me', async () => {
        const data = await userApi.getMe()
        return data
    })

    const userData = ref({
        name: user.value?.username || user.value?.name || '',
        email: user.value?.email || '',
        phone: user.value?.phone || '',
    })

    const passwordData = ref({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const errors = reactive<Record<string, string>>({})
    const passwordErrors = reactive<Record<string, string>>({})
    const profileLoading = ref(false)
    const passwordLoading = ref(false)

    // Схемы валидации
    const profileSchema = yup.object({
        name: nameSchema,
        phone: phoneSchema,
    })

    const passwordChangeSchema = yup.object({
        currentPassword: passwordSchema,
        newPassword: passwordSchema,
        confirmPassword: yup
            .string()
            .required('Подтверждение пароля обязательно')
            .oneOf([yup.ref('newPassword')], 'Пароли должны совпадать'),
    })

    watch(
        user,
        newUser => {
            if (newUser) {
                userData.value = {
                    name: newUser.username || newUser.name || '',
                    email: newUser.email,
                    phone: newUser.phone || '',
                }
            }
        },
        { immediate: true }
    )

    const validateField = async (field: string) => {
        try {
            await profileSchema.validateAt(field, userData.value)
            errors[field] = ''
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                errors[field] = error.message
            }
        }
    }

    const validatePasswordField = async (field: string) => {
        try {
            await passwordChangeSchema.validateAt(field, passwordData.value)
            passwordErrors[field] = ''
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                passwordErrors[field] = error.message
            }
        }
    }

    const validateProfileForm = async (): Promise<boolean> => {
        try {
            await profileSchema.validate(userData.value, { abortEarly: false })
            Object.keys(errors).forEach(key => {
                errors[key] = ''
            })
            return true
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                error.inner.forEach(err => {
                    if (err.path) {
                        errors[err.path] = err.message
                    }
                })
            }
            return false
        }
    }

    const validatePasswordForm = async (): Promise<boolean> => {
        try {
            await passwordChangeSchema.validate(passwordData.value, { abortEarly: false })
            Object.keys(passwordErrors).forEach(key => {
                passwordErrors[key] = ''
            })
            return true
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                error.inner.forEach(err => {
                    if (err.path) {
                        passwordErrors[err.path] = err.message
                    }
                })
            }
            return false
        }
    }

    const updateProfile = async () => {
        if (!user.value?.id) return

        const isValid = await validateProfileForm()
        if (!isValid) return

        profileLoading.value = true
        try {
            const updateData = {
                username: userData.value.name, // Strapi использует username для имени
                phone: normalizePhone(userData.value.phone),
            }

            await userApi.update(user.value.id, updateData)
            toast.showSuccess('Профиль обновлен')
            
            // Обновляем данные пользователя после успешного обновления
            const updatedUser = await userApi.getMe()
            authStore.setUser(updatedUser)
        } catch (error: unknown) {
            toast.showError(error, 'updateProfile')
        } finally {
            profileLoading.value = false
        }
    }

    const changePassword = async () => {
        if (!user.value?.id) return

        const isValid = await validatePasswordForm()
        if (!isValid) return

        passwordLoading.value = true
        try {
            await userApi.update(user.value.id, {
                currentPassword: passwordData.value.currentPassword,
                password: passwordData.value.newPassword,
            })
            toast.showSuccess('Пароль изменен')
            passwordData.value = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            }
            // Очищаем ошибки после успешного изменения
            Object.keys(passwordErrors).forEach(key => {
                passwordErrors[key] = ''
            })
        } catch (error: unknown) {
            toast.showError(error, 'changePassword')
        } finally {
            passwordLoading.value = false
        }
    }
</script>
