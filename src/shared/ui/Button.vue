<template>
    <component
        :is="tag"
        v-bind="$attrs"
        :class="[variant === 'black' ? 'bg-brand hover:bg-brandGradient3 active:bg-brandGradient' : 'bg-brandGradient hover:bg-brandGradient2 active:bg-brandGradient3', disabled && 'opacity-70 pointer-events-none', active && variant === 'black' ? '!bg-brandGradient' : active ? '!bg-brandGradient3' : '']"
        class="px-4 py-2 text-white rounded-2xl flex items-center justify-center gap-3 transition-all duration-[2000] delay-150 ease-in-out bg-[0_100%] hover:bg-[0_0]"
    >
        <slot />
    </component>
</template>

<script setup lang="ts">
import type { Component } from "vue"

interface Props {
    tag?: Component | string;
    variant?: "black" | "gradient";
    disabled?: boolean;
    active?: boolean
}

const {
    tag = "button",
    variant = "gradient",
    disabled = false,
    active = false
} = defineProps<Props>()
</script>