<script setup lang="ts">
import IFilter from "~~/interface/filter";
import IBookTableFilter from "~~/interface/table/bookTableFilter";
interface Props {
  filters: IBookTableFilter;
}

const { filters } = defineProps<Props>();
const emit = defineEmits<{ (e: "change", key: string, value: string): void }>();
const filterEntries: [string, IFilter[]][] = Object.entries(filters);
</script>

<template>
  <VSelect
    v-for="(filter, index) in filterEntries"
    :key="index"
    :label="filter[0].toLocaleUpperCase()"
    :items="filter[1].map((f) => f.name)"
    @update:model-value="(val) => emit('change', filter[0], val)"
  />
</template>
