import { ref, computed } from 'vue'
import { useToast } from './useToast'
import type { ErrorContext } from './errorHandler'
import { SortOrder } from '../types/enums'

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
    const sortOrder = ref<SortOrder>(SortOrder.ASC)
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
                const sortKey = sortBy.value!
                const aValue: unknown = (a as Record<string, unknown>)[String(sortKey)]
                const bValue: unknown = (b as Record<string, unknown>)[String(sortKey)]

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortOrder.value === SortOrder.ASC 
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue)
                }
                
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    if (aValue < bValue) return sortOrder.value === SortOrder.ASC ? -1 : 1
                    if (aValue > bValue) return sortOrder.value === SortOrder.ASC ? 1 : -1
                }
                
                // Для других типов конвертируем в строку
                const aStr = String(aValue)
                const bStr = String(bValue)
                return sortOrder.value === SortOrder.ASC 
                    ? aStr.localeCompare(bStr)
                    : bStr.localeCompare(aStr)
                return 0
            })
        }

        return filtered
    })

    const loadData = async () => {
        isLoading.value = true
        try {
            items.value = await config.fetchData()
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            showError(errorMessage, config.errorContext)
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
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            showError(errorMessage, config.errorContext)
        }
    }

    const sort = (column: keyof T) => {
        if (sortBy.value === column) {
            sortOrder.value = sortOrder.value === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC
        } else {
            sortBy.value = column
            sortOrder.value = SortOrder.ASC
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
