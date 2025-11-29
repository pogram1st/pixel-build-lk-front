<template>
    <div class="fixed top-4 right-4 z-50 space-y-2">
        <TransitionGroup name="alert" tag="div">
            <Alert
                v-for="alert in alertStore.alerts"
                :key="alert.id"
                :message="alert.message"
                :description="alert.description"
                :variant="alert.variant"
                :on-close="() => alertStore.removeAlert(alert.id)"
            />
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { useAlertStore } from "../stores/useAlertStore"
import Alert from "./Alert.vue"

const alertStore = useAlertStore()
</script>

<style scoped>
.alert-enter-active,
.alert-leave-active {
    transition: all 0.3s ease;
}

.alert-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.alert-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
</style>