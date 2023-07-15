<script setup lang="ts">
//state
const errors = useState<string[]>(() => []);

//type, status, publisher
const filters = useState(() => ["All", "All", "All"]);

//store
const tableStore = useTableStore();
const globalStore = useGlobalStore();
const booksStore = useBooksStore();

onMounted(async () => {
  globalStore.startLoading();

  const resultFilters = await tableStore.fetchBooksTableFilters();
  if (!resultFilters.success) {
    if (resultFilters.errorData) {
      errors.value.push(resultFilters.errorData);
    }
  }

  const resultHeaders = await tableStore.fetchBooksTableHeaders();
  if (!resultHeaders.success) {
    if (resultHeaders.errorData) {
      errors.value.push(resultHeaders.errorData);
    }
  }

  const resultBooks = await booksStore.fetchBooks();
  if (!resultBooks.success) {
    if (resultBooks.errorData) {
      errors.value.push(resultBooks.errorData);
    }
  }

  globalStore.stopLoading();
});
</script>

<template>
  <template v-if="errors.length != 0">
    <p v-for="error in errors" class="text-red">{{ error }}</p>
  </template>
  <VContainer v-else class="h-100">
    {{ tableStore.filters }}
    <VRow align="center" class="h-100">
      <VCol cols="2">
        <VProgressCircular
          v-if="tableStore.filters == null"
          :indeterminate="true"
          size="100"
        />
        <CustomFilter
          v-else
          v-for="(filterEntries, i) in Object.entries(tableStore.filters)"
          :filters="filterEntries[1]"
          :label="filterEntries[0]"
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
  </VContainer>
</template>
