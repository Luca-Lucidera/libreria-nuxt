<script setup lang="ts">
type FilterProps = {
  filters: string[];
  label: string;
  modelValue: string;
};
defineProps<FilterProps>();
defineEmits(["update:modelValue"]);
</script>

<template>
  <VSelect
    :items="filters"
    :label="label.toUpperCase()"
    :model-value="modelValue"
    :clearable="modelValue !== 'All'"
    @update:modelValue="(val: string) => $emit('update:modelValue', val)"
    @click:clear="() => $emit('update:modelValue', 'All')"
  />
</template>
