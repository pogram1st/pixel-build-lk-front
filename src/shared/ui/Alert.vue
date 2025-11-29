<template>
    <div
        :class="[
            'grid gap-4 grid-cols-[32px_1fr_28px] py-3 px-5 xl:px-6 rounded-brand shadow-brandCard',
            containerClasses[variant],
            bgClasses[variant],
        ]"
        role="alert"
    >
        <div
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :class="[primaryBgClasses[variant]]"
        >
            <component
                :is="icons[variant]"
                :class="[textClasses[variant]]"
                class="w-[14px] h-[14px]"
            />
        </div>

        <div
            :class="[primaryTextClasses[variant], !description && 'pt-1 xl:pt-[4px]']"
            class="grid gap-1"
        >
            <p class="font-medium">{{ message }}</p>
            <p v-if="description" class="text-sm">
                {{ description }}
            </p>
        </div>

        <div class="h-full flex items-center justify-center">
            <div class="p-1" @click="onClose">
                <ErrorIcon class="w-4 h-4 cursor-pointer" :class="[primaryTextClasses[variant]]" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Component } from 'vue'
    import type { AlertVariant } from '../stores/useAlertStore'
    import ErrorIcon from './icons/ErrorIcon.vue'
    import SuccessIcon from './icons/SuccessIcon.vue'
    import WarningIcon from './icons/WarningIcon.vue'
    import InfoIcon from './icons/InfoIcon.vue'

    interface AlertProps {
        message: string
        description?: string
        variant: AlertVariant
        onClose: () => void
    }

    defineProps<AlertProps>()

    const primaryTextClasses: Record<AlertVariant, string> = {
        success: 'text-green-500',
        error: 'text-red-500',
        warning: 'text-yellow-500',
        info: 'text-blue-500',
    }

    const primaryBgClasses: Record<AlertVariant, string> = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
    }

    const bgClasses: Record<AlertVariant, string> = {
        success: 'bg-green-100',
        error: 'bg-red-100',
        warning: 'bg-yellow-100',
        info: 'bg-blue-100',
    }

    const textClasses: Record<AlertVariant, string> = {
        success: 'text-green-100',
        error: 'text-red-100',
        warning: 'text-yellow-100',
        info: 'text-blue-100',
    }

    const containerClasses: Record<AlertVariant, string> = {
        success: 'border-2 border-green-500',
        error: 'border-2 border-red-500',
        warning: 'border-2 border-yellow-500',
        info: 'border-2 border-blue-500',
    }

    const icons: Record<AlertVariant, Component> = {
        success: SuccessIcon,
        error: ErrorIcon,
        warning: WarningIcon,
        info: InfoIcon,
    }
</script>
