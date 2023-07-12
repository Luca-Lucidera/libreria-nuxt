<template>
  <VSelect
    v-for="(filter, index) in filterEntries"
    :key="index"
    :label="filter[0].toLocaleUpperCase()"
    :items="filter[1]"
    @update:model-value="(val) => emit('change', filter[0], val)"
  />
</template>

<script setup lang="ts">
interface Props {
  filters: IBookTableFilter;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: "change", key: string, value: string): void }>();
const filterEntries: [string, string[]][] = Object.entries(props.filters);
</script>
