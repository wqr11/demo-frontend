<script setup lang="ts">
const { label, value, onInput } = defineProps<{
  label?: string
  value?: number
  onInput?: (e: Event) => unknown
}>()
</script>

<template>
  <label>{{ label }}</label>
  <input type="number" @input="onInput" :value="value" />
</template>
