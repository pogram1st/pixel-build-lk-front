<template>
  <span
    class="px-3 py-1 rounded-full text-sm font-medium inline-block"
    :style="{ backgroundColor: color + '20', color: color }"
  >
    {{ name }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  name: string
  color: string
}

defineProps<Props>()
</script>

