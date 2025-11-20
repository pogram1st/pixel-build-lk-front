import { ref, computed } from 'vue'
import { useToast } from './useToast'
import type { ErrorContext } from './errorHandler'

export interface TableColumn<T = Record<string, unknown>> {
    key: keyof T
    label: string
    sortable?: boolean
    formatter?: (value: unknown, item: T) => string
    width?: string
}

export interface TableConfig<T> {
    columns: TableColumn<T>[]
    fetchData: () => Promise<T[]>
    deleteItem?: (id: string | number) => Promise<void>
    errorContext?: ErrorContext
}

export function useTable<T extends { id: string | number }>(config: TableConfig<T>) {
    const { showError, showSuccess } = useToast()

    const items = ref<T[]>([])
    const isLoading = ref(false)
    const sortBy = ref<keyof T | null>(null)
    const sortOrder = ref<'asc' | 'desc'>('asc')
    const searchQuery = ref('')

    const filteredItems = computed(() => {
        let filtered = items.value

        // Поиск
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase()
            filtered = filtered.filter(item => {
                return Object.values(item).some(value =>
                    String(value).toLowerCase().includes(query)
                )
            })
        }

        // Сортировка
        if (sortBy.value) {
            filtered = [...filtered].sort((a, b) => {
                const aValue = a[sortBy.value!]
                const bValue = b[sortBy.value!]

                if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
                if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
                return 0
            })
        }

        return filtered
    })

    const loadData = async () => {
        isLoading.value = true
        try {
            items.value = await config.fetchData()
        } catch (error) {
            showError(error, config.errorContext)
        } finally {
            isLoading.value = false
        }
    }

    const deleteItem = async (id: string | number) => {
        if (!config.deleteItem) return

        try {
            await config.deleteItem(id)
            items.value = items.value.filter(item => item.id !== id)
            showSuccess('Элемент удален')
        } catch (error) {
            showError(error, config.errorContext)
        }
    }

    const sort = (column: keyof T) => {
        if (sortBy.value === column) {
            sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
        } else {
            sortBy.value = column
            sortOrder.value = 'asc'
        }
    }

    const refresh = () => {
        loadData()
    }

    return {
        items: filteredItems,
        isLoading,
        searchQuery,
        sortBy,
        sortOrder,
        loadData,
        deleteItem,
        sort,
        refresh,
    }
}
