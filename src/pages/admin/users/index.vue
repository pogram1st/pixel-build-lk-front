<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Управление пользователями
            </h1>
            <AppButton @click="showCreateModal = true"> Создать пользователя </AppButton>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div class="p-6">
                <div v-if="!users || users.length === 0" class="text-center py-8 text-gray-500">
                    Нет пользователей
                </div>
                <AppTable v-else :columns="columns" :data="users">
                    <template #cell-role="{ value }">
                        <span
                            class="px-2 py-1 rounded text-xs font-medium"
                            :class="
                                value === 'ADMIN'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                            "
                        >
                            {{ value }}
                        </span>
                    </template>
                    <template #cell-actions="{ row }">
                        <div class="flex space-x-2">
                            <button
                                @click="editUser(row)"
                                class="text-primary-600 hover:text-primary-800"
                            >
                                Редактировать
                            </button>
                            <button
                                @click="deleteUser(row.id)"
                                class="text-red-600 hover:text-red-800"
                            >
                                Удалить
                            </button>
                        </div>
                    </template>
                </AppTable>
            </div>
        </div>

        <AppModal v-model="showCreateModal" title="Создать пользователя">
            <div class="space-y-4">
                <AppInput
                    v-model="userForm.email"
                    type="email"
                    label="Email"
                    placeholder="email@example.com"
                />
                <AppInput
                    v-model="userForm.password"
                    type="password"
                    label="Пароль"
                    placeholder="Минимум 6 символов"
                />
                <AppInput v-model="userForm.name" label="Имя" placeholder="Имя пользователя" />
                <AppInput
                    v-model="userForm.phone"
                    label="Телефон"
                    placeholder="+7 (999) 123-45-67"
                />
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Роль
                    </label>
                    <select
                        v-model="userForm.role"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>
            </div>
            <template #footer>
                <AppButton variant="outline" @click="showCreateModal = false"> Отмена </AppButton>
                <AppButton @click="createUser"> Создать </AppButton>
            </template>
        </AppModal>

        <AppModal v-model="showEditModal" title="Редактировать пользователя">
            <div class="space-y-4">
                <AppInput
                    v-model="editForm.email"
                    type="email"
                    label="Email"
                    placeholder="email@example.com"
                />
                <AppInput v-model="editForm.name" label="Имя" placeholder="Имя пользователя" />
                <AppInput
                    v-model="editForm.phone"
                    label="Телефон"
                    placeholder="+7 (999) 123-45-67"
                />
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Роль
                    </label>
                    <select
                        v-model="editForm.role"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>
            </div>
            <template #footer>
                <AppButton variant="outline" @click="showEditModal = false"> Отмена </AppButton>
                <AppButton @click="updateUser"> Сохранить </AppButton>
            </template>
        </AppModal>
    </div>
</template>

<script setup lang="ts">
    import type { AdminUser } from '@shared/types/api'
    import { adminApi } from '@shared/api/adminApi'
    import { useToast } from '@shared/lib/useToast'
    import AppInput from '@shared/ui/input/AppInput.vue'
    import AppButton from '@shared/ui/button/AppButton.vue'
    import AppModal from '@shared/ui/modal/AppModal.vue'
    import AppTable from '@shared/ui/table/AppTable.vue'

    definePageMeta({
        layout: 'admin',
    })

    const { data: users, refresh } = await useAsyncData('admin-users', async () => {
        const { data } = await adminApi.users.getAll()
        return data
    })

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'email', label: 'Email' },
        { key: 'name', label: 'Имя' },
        { key: 'phone', label: 'Телефон' },
        { key: 'role', label: 'Роль' },
        { key: 'actions', label: 'Действия' },
    ]

    const showCreateModal = ref(false)
    const showEditModal = ref(false)
    const toast = useToast()
    const userForm = ref({
        email: '',
        password: '',
        name: '',
        phone: '',
        role: 'USER',
    })
    const editForm = ref({
        id: 0,
        email: '',
        name: '',
        phone: '',
        role: 'USER',
    })

    const createUser = async () => {
        try {
            await adminApi.users.create(userForm.value)
            toast.showSuccess('Пользователь успешно создан')
            showCreateModal.value = false
            userForm.value = { email: '', password: '', name: '', phone: '', role: 'USER' }
            await refresh()
        } catch (error: unknown) {
            toast.showError(error, 'createUser')
        }
    }

    const editUser = (user: AdminUser) => {
        editForm.value = { ...user }
        showEditModal.value = true
    }

    const updateUser = async () => {
        try {
            await adminApi.users.update(editForm.value.id, editForm.value)
            toast.showSuccess('Пользователь успешно обновлен')
            showEditModal.value = false
            await refresh()
        } catch (error: unknown) {
            toast.showError(error, 'updateUser')
        }
    }

    const deleteUser = async (id: number) => {
        if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return
        try {
            await adminApi.users.delete(id)
            toast.showSuccess('Пользователь успешно удален')
            await refresh()
        } catch (error: unknown) {
            toast.showError(error, 'deleteUser')
        }
    }
</script>
