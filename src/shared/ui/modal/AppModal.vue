<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="$emit('update:modelValue', false)"
      >
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          
          <div
            class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            <div class="px-4 pt-5 pb-4 sm:p-6">
              <div class="flex items-start justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {{ title }}
                </h3>
                <button
                  @click="$emit('update:modelValue', false)"
                  class="text-gray-400 hover:text-gray-500"
                >
                  <span class="sr-only">Закрыть</span>
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <slot />
            </div>
            <div v-if="$slots.footer" class="px-4 py-3 sm:px-6 bg-gray-50 dark:bg-gray-700 sm:flex sm:flex-row-reverse">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: ''
})

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

