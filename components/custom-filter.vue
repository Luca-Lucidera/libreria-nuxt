<script setup lang="ts">
type FilterProps = {
  filters: string[];
  label: string;
};

const props = defineProps<FilterProps>();
const filterModel = defineModel<string>({ required: true, default: "" });

console.log(`filters -> ${props.filters}, -> label ${props.label}`)
</script>

<template>
  <p>filtersProps: {{ filters }} | labelProps: {{ label }}</p>
  <VSelect
    :items="props.filters"
    :label="props.label.toUpperCase()"
    v-model="filterModel"
  />
</template>
