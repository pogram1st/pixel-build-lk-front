import { ref } from 'vue'

export interface ModalState {
    isOpen: boolean
    title: string
    data?: unknown
}

export function useModal() {
    const modals = ref<Record<string, ModalState>>({})

    const openModal = (name: string, title: string, data?: unknown) => {
        modals.value[name] = {
            isOpen: true,
            title,
            data,
        }
    }

    const closeModal = (name: string) => {
        if (modals.value[name]) {
            modals.value[name].isOpen = false
        }
    }

    const isModalOpen = (name: string) => {
        return modals.value[name]?.isOpen || false
    }

    const getModalData = (name: string) => {
        return modals.value[name]?.data
    }

    const getModalTitle = (name: string) => {
        return modals.value[name]?.title || ''
    }

    return {
        openModal,
        closeModal,
        isModalOpen,
        getModalData,
        getModalTitle,
    }
}

// Глобальный композабл для модальных окон
const globalModal = useModal()

export const useGlobalModal = () => globalModal
