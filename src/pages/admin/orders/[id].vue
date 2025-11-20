<template>
    <div v-if="order" class="space-y-6">
        <!-- Заголовок -->
        <div class="flex justify-between items-start">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                    Заказ #{{ order.id }} — {{ order.service?.name || 'Без услуги' }}
                </h1>
                <p class="text-gray-500 dark:text-gray-400 mt-2">
                    Создан: {{ new Date(order.createdAt).toLocaleString('ru-RU') }}
                </p>
            </div>
            <div class="flex items-center space-x-4">
                <AppButton variant="outline" @click="handleSave"> Сохранить </AppButton>
                <AppButton variant="outline" @click="showStatusModal = true">
                    Изменить статус
                </AppButton>
                <AppButton @click="handleSendToClient"> Отправить клиенту </AppButton>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Левый блок (70%) -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Информация о заказе -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Информация о заказе
                    </h2>
                    <div class="space-y-4">
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Описание
                            </label>
                            <textarea
                                v-model="formData.description"
                                rows="4"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Описание заказа..."
                            ></textarea>
                        </div>

                        <div
                            v-if="
                                order.files &&
                                order.files.filter(f => f.type === 'CLIENT_MATERIAL').length > 0
                            "
                        >
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Материалы от клиента
                            </label>
                            <div class="space-y-2">
                                <div
                                    v-for="file in order.files.filter(
                                        f => f.type === 'CLIENT_MATERIAL'
                                    )"
                                    :key="file.id"
                                    class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                                >
                                    <span class="text-sm text-gray-700 dark:text-gray-300">{{
                                        file.filename
                                    }}</span>
                                    <a
                                        :href="`${apiBase}/uploads/${file.path.split('/').pop()}`"
                                        target="_blank"
                                        class="text-primary-600 hover:text-primary-800 text-sm"
                                    >
                                        Скачать
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div
                            v-if="
                                order.files &&
                                order.files.filter(f => f.type === 'ADMIN_FILE').length > 0
                            "
                        >
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Файлы от администратора
                            </label>
                            <div class="space-y-2">
                                <div
                                    v-for="file in order.files.filter(f => f.type === 'ADMIN_FILE')"
                                    :key="file.id"
                                    class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                                >
                                    <span class="text-sm text-gray-700 dark:text-gray-300">{{
                                        file.filename
                                    }}</span>
                                    <div class="flex items-center space-x-2">
                                        <a
                                            :href="`${apiBase}/uploads/${file.path.split('/').pop()}`"
                                            target="_blank"
                                            class="text-primary-600 hover:text-primary-800 text-sm"
                                        >
                                            Скачать
                                        </a>
                                        <button
                                            @click="deleteFile(file.id)"
                                            class="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Скриншоты прогресса -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                            Скриншоты прогресса
                        </h2>
                        <AppButton variant="outline" size="sm" @click="showUploadModal = true">
                            Добавить скриншот
                        </AppButton>
                    </div>
                    <div
                        v-if="
                            order.files &&
                            order.files.filter(f => f.type === 'PROGRESS_SCREENSHOT').length > 0
                        "
                        class="space-y-3"
                    >
                        <div
                            v-for="file in order.files
                                .filter(f => f.type === 'PROGRESS_SCREENSHOT')
                                .sort(
                                    (a, b) =>
                                        new Date(b.createdAt).getTime() -
                                        new Date(a.createdAt).getTime()
                                )"
                            :key="file.id"
                            class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                            <div class="flex items-center space-x-3">
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    {{ new Date(file.createdAt).toLocaleDateString('ru-RU') }}
                                </span>
                                <span class="text-sm text-gray-700 dark:text-gray-300">{{
                                    file.filename
                                }}</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <a
                                    :href="`${apiBase}/uploads/${file.path.split('/').pop()}`"
                                    target="_blank"
                                    class="text-primary-600 hover:text-primary-800 text-sm"
                                >
                                    Скачать
                                </a>
                                <button
                                    @click="deleteFile(file.id)"
                                    class="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 text-gray-500">Нет скриншотов</div>
                </div>
            </div>

            <!-- Правый блок (30%) -->
            <div class="space-y-6">
                <!-- Клиент -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Клиент</h2>
                    <div class="space-y-2">
                        <div>
                            <span class="text-sm text-gray-500 dark:text-gray-400">Имя:</span>
                            <span class="ml-2 font-medium text-gray-900 dark:text-white">{{
                                order.user?.name
                            }}</span>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                            <span class="ml-2 font-medium text-gray-900 dark:text-white">{{
                                order.user?.email
                            }}</span>
                        </div>
                        <div v-if="order.telegram">
                            <span class="text-sm text-gray-500 dark:text-gray-400">Telegram:</span>
                            <span class="ml-2 font-medium text-gray-900 dark:text-white">{{
                                order.telegram
                            }}</span>
                        </div>
                        <div v-if="order.whatsapp">
                            <span class="text-sm text-gray-500 dark:text-gray-400">WhatsApp:</span>
                            <span class="ml-2 font-medium text-gray-900 dark:text-white">{{
                                order.whatsapp
                            }}</span>
                        </div>
                    </div>
                </div>

                <!-- Статус -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Статус</h2>
                    <select
                        v-model="formData.statusId"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option v-for="status in statuses" :key="status.id" :value="status.id">
                            {{ status.name }}
                        </option>
                    </select>
                </div>

                <!-- Оплата -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Оплата</h2>
                    <div class="space-y-4">
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Сумма
                            </label>
                            <AppInput
                                v-model.number="formData.amount"
                                type="number"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Статус оплаты
                            </label>
                            <div class="text-sm">
                                <span
                                    v-if="order.paymentLink"
                                    class="text-green-600 dark:text-green-400"
                                    >Ожидает оплаты</span
                                >
                                <span v-else class="text-gray-500">Не указано</span>
                            </div>
                        </div>
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Ссылка на оплату
                            </label>
                            <AppInput v-model="formData.paymentLink" placeholder="https://..." />
                        </div>
                        <div class="flex space-x-2">
                            <AppButton variant="outline" size="sm" @click="copyPaymentLink">
                                Скопировать
                            </AppButton>
                            <AppButton size="sm" @click="sendPaymentLink">
                                Отправить клиенту
                            </AppButton>
                        </div>
                    </div>
                </div>

                <!-- История -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        История
                    </h2>
                    <div
                        v-if="order.history && order.history.length > 0"
                        class="space-y-3 max-h-96 overflow-y-auto"
                    >
                        <div
                            v-for="item in order.history"
                            :key="item.id"
                            class="text-sm border-l-2 border-gray-200 dark:border-gray-700 pl-3"
                        >
                            <div class="text-gray-500 dark:text-gray-400">
                                {{ new Date(item.createdAt).toLocaleString('ru-RU') }}
                            </div>
                            <div class="text-gray-900 dark:text-white">
                                {{ item.user?.name || 'Система' }}: {{ item.description }}
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-4 text-gray-500">Нет истории</div>
                </div>
            </div>
        </div>

        <!-- Модальное окно изменения статуса -->
        <AppModal v-model="showStatusModal" title="Изменить статус">
            <div class="space-y-4">
                <select
                    v-model="formData.statusId"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                >
                    <option v-for="status in statuses" :key="status.id" :value="status.id">
                        {{ status.name }}
                    </option>
                </select>
            </div>
            <template #footer>
                <AppButton variant="outline" @click="showStatusModal = false"> Отмена </AppButton>
                <AppButton @click="updateStatus"> Сохранить </AppButton>
            </template>
        </AppModal>

        <!-- Модальное окно загрузки файла -->
        <AppModal v-model="showUploadModal" title="Загрузить скриншот">
            <div class="space-y-4">
                <input
                    type="file"
                    ref="fileInput"
                    @change="handleFileSelect"
                    accept="image/*"
                    class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
            </div>
            <template #footer>
                <AppButton variant="outline" @click="showUploadModal = false"> Отмена </AppButton>
                <AppButton @click="uploadFile" :disabled="!selectedFile"> Загрузить </AppButton>
            </template>
        </AppModal>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, watch } from 'vue'
    import { adminApi } from '@shared/api/adminApi'
    import { useToast } from '@shared/lib/useToast'
    import AppButton from '@shared/ui/button/AppButton.vue'
    import AppInput from '@shared/ui/input/AppInput.vue'
    import AppModal from '@shared/ui/modal/AppModal.vue'

    definePageMeta({
        layout: 'admin',
    })

    const route = useRoute()
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || 'http://localhost:3000'
    const orderId = Number(route.params.id)
    const toast = useToast()

    const { data: order, refresh } = await useAsyncData(`admin-order-${orderId}`, async () => {
        const { data } = await adminApi.orders.getById(orderId)
        return data
    })

    const { data: statuses } = await useAsyncData('statuses', async () => {
        const { data } = await adminApi.statuses.getAll()
        return data
    })

    const formData = reactive({
        description: order.value?.description || '',
        amount: order.value?.amount || undefined,
        paymentLink: order.value?.paymentLink || '',
        statusId: order.value?.statusId || undefined,
    })

    watch(
        order,
        newOrder => {
            if (newOrder) {
                formData.description = newOrder.description || ''
                formData.amount = newOrder.amount || undefined
                formData.paymentLink = newOrder.paymentLink || ''
                formData.statusId = newOrder.statusId || undefined
            }
        },
        { immediate: true }
    )

    const showStatusModal = ref(false)
    const showUploadModal = ref(false)
    const selectedFile = ref<File | null>(null)
    const fileInput = ref<HTMLInputElement | null>(null)

    const handleFileSelect = (event: Event) => {
        const target = event.target as HTMLInputElement
        if (target.files && target.files[0]) {
            selectedFile.value = target.files[0]
        }
    }

    const handleSave = async () => {
        try {
            await adminApi.orders.update(orderId, formData)
            toast.showSuccess('Заказ обновлен')
            await refresh()
        } catch (error: unknown) {
            toast.showError(error, 'updateOrder')
        }
    }

    const updateStatus = async () => {
        try {
            await adminApi.orders.updateStatus(orderId, { statusId: formData.statusId! })
            toast.showSuccess('Статус обновлен')
            showStatusModal.value = false
            await refresh()
        } catch (error: unknown) {
            toast.showError(error, 'updateStatus')
        }
    }

    const uploadFile = async () => {
        if (!selectedFile.value) return

        try {
            await adminApi.orders.uploadFile(orderId, selectedFile.value, 'PROGRESS_SCREENSHOT')
            toast.showSuccess('Файл загружен')
            showUploadModal.value = false
            selectedFile.value = null
            if (fileInput.value) fileInput.value.value = ''
            await refresh()
        } catch (error: unknown) {
            toast.showError(error, 'uploadFile')
        }
    }

    const deleteFile = async (fileId: number) => {
        if (!confirm('Удалить файл?')) return

        try {
            await adminApi.orders.deleteFile(orderId, fileId)
            toast.showSuccess('Файл удален')
            await refresh()
        } catch (error: unknown) {
            toast.showError(error, 'deleteFile')
        }
    }

    const copyPaymentLink = async () => {
        if (formData.paymentLink) {
            await navigator.clipboard.writeText(formData.paymentLink)
            toast.showSuccess('Ссылка скопирована')
        }
    }

    const sendPaymentLink = async () => {
        if (!formData.paymentLink) {
            toast.error('Сначала укажите ссылку на оплату')
            return
        }
        // TODO: Реализовать отправку ссылки клиенту
        toast.showSuccess('Ссылка отправлена клиенту')
    }

    const handleSendToClient = () => {
        // TODO: Реализовать отправку уведомления клиенту
        toast.showSuccess('Уведомление отправлено клиенту')
    }
</script>
