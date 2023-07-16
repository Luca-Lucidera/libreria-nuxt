<script setup lang="ts">
type FilterProps = {
  filters: string[];
  label: string;
};

const { filters, label } = defineProps<FilterProps>();
const filterModel = defineModel<string>({ required: true, default: "" });
</script>

<template>
  <p>filtersProps: {{ filters }} | labelProps: {{ label }}</p>
  <VSelect
    :items="filters"
    :label="label.toUpperCase()"
    v-model="filterModel"
  />
</template>
