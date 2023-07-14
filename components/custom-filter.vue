<script setup lang="ts">
type FilterProps = {
  filters: string[];
  label: string
}

const {filters, label} = defineProps<FilterProps>()
const filterModel = defineModel<string>("");
</script>

<template>
  <VSelect
      :items="filters"
      :label="label.toUpperCase()"
      v-model="filterModel"
  />
</template>