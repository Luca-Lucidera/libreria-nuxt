<script setup lang="ts">
const tableStore = useTableStore();
const booksStore = useBooksStore();

//type, status, publisher
const filters = useState(() => ["All", "All", "All"]);
</script>

<template>
  <VRow align="center" class="h-100">
    <VCol cols="2">
      <VProgressCircular
          v-if="!tableStore.areFiltersReady()"
          :indeterminate="true"
          size="100"
      />
      <CustomFilter
          v-else
          v-for="(filterEntries, i) in Object.entries(tableStore.getFilters)"
          :key="i"
          :label="filterEntries[0]"
          :filters="filterEntries[1]"
          v-model="filters[i]"
      />
    </VCol>

    <VCol>
      <BooksTable
          :books="booksStore.filteredBooks(filters[0], filters[1], filters[2])"
          :headers="tableStore.getHeaders"
      />
    </VCol>
  </VRow>
</template>