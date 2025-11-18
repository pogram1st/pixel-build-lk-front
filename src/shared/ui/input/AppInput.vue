<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      v-maska="mask"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'w-full px-3 py-2 border rounded-md transition-colors',
        'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        { 'opacity-50 cursor-not-allowed': disabled },
        error 
          ? 'border-red-500 dark:border-red-500' 
          : 'border-gray-300 dark:border-gray-600'
      ]"
      @input="handleInput"
      @blur="$emit('blur')"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
  type?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  mask?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'blur': []
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value: string | number = target.value
  
  if (props.type === 'number') {
    const numValue = Number(value)
    value = isNaN(numValue) ? value : numValue
  }
  
  emit('update:modelValue', value)
}
</script>

