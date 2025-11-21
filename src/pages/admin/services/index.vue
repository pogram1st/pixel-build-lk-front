<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Управление услугами</h1>
            <AppButton @click="showCreateModal = true"> Создать услугу </AppButton>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div class="p-6">
                <div
                    v-if="!services || services.length === 0"
                    class="text-center py-8 text-gray-500"
                >
                    Нет услуг
                </div>
                <AppTable v-else :columns="columns" :data="services">
                    <template #cell-price="{ value }">
                        {{ value ? `${value} ₽` : '-' }}
                    </template>
                    <template #cell-actions="{ row }">
                        <div class="flex space-x-2">
                            <button
                                @click="editService(row as Service)"
                                class="text-primary-600 hover:text-primary-800"
                            >
                                Редактировать
                            </button>
                            <button
                                @click="deleteService(row.id)"
                                class="text-red-600 hover:text-red-800"
                            >
                                Удалить
                            </button>
                        </div>
                    </template>
                </AppTable>
            </div>
        </div>

        <AppModal v-model="showCreateModal" title="Создать услугу">
            <div class="space-y-4">
                <AppInput
                    v-model="serviceForm.name"
                    label="Название"
                    placeholder="Название услуги"
                />
                <AppInput v-model="serviceForm.price" type="number" label="Цена" placeholder="0" />
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Описание
                    </label>
                    <textarea
                        v-model="serviceForm.description"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows="3"
                        placeholder="Описание услуги"
                    />
                </div>
            </div>
            <template #footer>
                <AppButton variant="outline" @click="showCreateModal = false"> Отмена </AppButton>
                <AppButton @click="createService"> Создать </AppButton>
            </template>
        </AppModal>

        <AppModal v-model="showEditModal" title="Редактировать услугу">
            <div class="space-y-4">
                <AppInput v-model="editForm.name" label="Название" placeholder="Название услуги" />
                <AppInput v-model="editForm.price" type="number" label="Цена" placeholder="0" />
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Описание
                    </label>
                    <textarea
                        v-model="editForm.description"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows="3"
                        placeholder="Описание услуги"
                    />
                </div>
            </div>
            <template #footer>
                <AppButton variant="outline" @click="showEditModal = false"> Отмена </AppButton>
                <AppButton @click="updateService"> Сохранить </AppButton>
            </template>
        </AppModal>
    </div>
</template>

<script setup lang="ts">
    import type { Service } from '@shared/types/api'
    import { adminApi } from '@shared/api/adminApi'
    import { useToast } from '@shared/lib/useToast'
    import AppInput from '@shared/ui/input/AppInput.vue'
    import AppButton from '@shared/ui/button/AppButton.vue'
    import AppModal from '@shared/ui/modal/AppModal.vue'
    import AppTable from '@shared/ui/table/AppTable.vue'

    definePageMeta({
        layout: 'admin',
    })

    const { data: services, refresh } = await useAsyncData('admin-services', async () => {
        const data = await adminApi.services.getAll()
        return data
    })

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Название' },
        { key: 'price', label: 'Цена' },
        { key: 'description', label: 'Описание' },
        { key: 'actions', label: 'Действия' },
    ]

    const showCreateModal = ref(false)
    const showEditModal = ref(false)
    const toast = useToast()
    const serviceForm = ref({
        name: '',
        price: '',
        description: '',
    })
    const editForm = ref({
        id: 0,
        name: '',
        price: '',
        description: '',
    })

    const createService = async () => {
        try {
            await adminApi.services.create({
                ...serviceForm.value,
                price: serviceForm.value.price ? Number(serviceForm.value.price) : undefined,
            })
            toast.showSuccess('Услуга успешно создана')
            showCreateModal.value = false
            serviceForm.value = { name: '', price: '', description: '' }
            await refresh()
        } catch (error: unknown) {
            toast.showError(error, 'createService')
        }
    }

    const editService = (service: Service) => {
        editForm.value = { 
            id: service.id,
            name: service.name,
            price: service.price?.toString() || '',
            description: service.description || ''
        }
        showEditModal.value = true
    }

    const updateService = async () => {
        try {
            await adminApi.services.update(editForm.value.id, {
                ...editForm.value,
                price: editForm.value.price ? Number(editForm.value.price) : undefined,
            })
            toast.showSuccess('Услуга успешно обновлена')
            showEditModal.value = false
            await refresh()
        } catch (error: unknown) {
            toast.showError(error, 'updateService')
        }
    }

    const deleteService = async (id: number) => {
        if (!confirm('Вы уверены, что хотите удалить эту услугу?')) return
        try {
            await adminApi.services.delete(id)
            toast.showSuccess('Услуга успешно удалена')
            await refresh()
        } catch (error: unknown) {
            toast.showError(error, 'deleteService')
        }
    }
</script>
