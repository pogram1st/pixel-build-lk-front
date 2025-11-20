<template>
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Профиль</h1>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
            <div>
                <h2 class="text-xl font-semibold mb-4">Личная информация</h2>
                <div class="space-y-4">
                    <AppInput v-model="userData.name" label="Имя" placeholder="Ваше имя" />
                    <AppInput
                        v-model="userData.email"
                        type="email"
                        label="Email"
                        placeholder="email@example.com"
                        disabled
                    />
                    <AppInput
                        v-model="userData.phone"
                        label="Телефон"
                        placeholder="+7 (999) 123-45-67"
                    />
                </div>
                <div class="mt-4">
                    <AppButton @click="updateProfile"> Сохранить изменения </AppButton>
                </div>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h2 class="text-xl font-semibold mb-4">Смена пароля</h2>
                <div class="space-y-4">
                    <AppInput
                        v-model="passwordData.currentPassword"
                        type="password"
                        label="Текущий пароль"
                        placeholder="Введите текущий пароль"
                    />
                    <AppInput
                        v-model="passwordData.newPassword"
                        type="password"
                        label="Новый пароль"
                        placeholder="Введите новый пароль"
                    />
                    <AppInput
                        v-model="passwordData.confirmPassword"
                        type="password"
                        label="Подтвердите пароль"
                        placeholder="Повторите новый пароль"
                    />
                </div>
                <div class="mt-4">
                    <AppButton @click="changePassword"> Изменить пароль </AppButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useAuthStore } from '@features/auth/model/useAuthStore'
    import { userApi } from '@shared/api/userApi'
    import { useToast } from '@shared/lib/useToast'
    import AppInput from '@shared/ui/input/AppInput.vue'
    import AppButton from '@shared/ui/button/AppButton.vue'

    definePageMeta({
        layout: 'default',
    })

    const authStore = useAuthStore()
    const toast = useToast()

    const { data: user } = await useAsyncData('user-me', async () => {
        const { data } = await userApi.getMe()
        return data
    })

    const userData = ref({
        name: user.value?.name || '',
        email: user.value?.email || '',
        phone: user.value?.phone || '',
    })

    const passwordData = ref({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    watch(
        user,
        newUser => {
            if (newUser) {
                userData.value = {
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phone || '',
                }
            }
        },
        { immediate: true }
    )

    const updateProfile = async () => {
        if (!user.value?.id) return

        try {
            await userApi.update(user.value.id, userData.value)
            toast.success('Профиль обновлен')
            // Обновляем данные пользователя после успешного обновления
            const updatedUser = await userApi.getMe()
            authStore.setUser(updatedUser)
        } catch (error: unknown) {
            toast.showError(error, 'updateProfile')
        }
    }

    const changePassword = async () => {
        if (!user.value?.id) return

        if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
            toast.error('Пароли не совпадают')
            return
        }
        try {
            await userApi.update(user.value.id, {
                currentPassword: passwordData.value.currentPassword,
                password: passwordData.value.newPassword, // Strapi использует password вместо newPassword
            })
            toast.success('Пароль изменен')
            passwordData.value = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            }
        } catch (error: unknown) {
            toast.showError(error, 'changePassword')
        }
    }
</script>
