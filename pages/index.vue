<script setup lang="ts">
//state
const errors = useState<string[]>(() => []);
const selectedFilter = useState("selected-filter", () => {
  return {
    type: "All",
    publisher: "All",
    status: "All",
  };
});

//store
const tableStore = useTableStore();
const globalStore = useGlobalStore();
const booksStore = useBooksStore();

onMounted(async () => {
  globalStore.startLoading();

  const resultFilters = await tableStore.fetchBooksTableFilters();
  if (!resultFilters.success) {
    if (resultFilters.errorData) {
      errors.value.push(resultFilters.errorData)
    }
  }

  const resultHeaders = await tableStore.fetchBooksTableHeaders();
  if (!resultHeaders.success) {
    if (resultHeaders.errorData) {
      errors.value.push(resultHeaders.errorData)
    }
  }

  const resultBooks = await booksStore.fetchBooks();
  if (!resultBooks.success) {
    if (resultBooks.errorData) {
      errors.value.push(resultBooks.errorData)
    }
  }

  globalStore.stopLoading();
});

//function
const handleChangeFilter = (key: string, value: string) => {
  type filterKey = keyof typeof selectedFilter.value;
  const k: filterKey = key as filterKey;
  if (k in selectedFilter.value) {
    selectedFilter.value[k] = value;
  }
};
</script>

<template>
  <template v-if="errors.length != 0">
    <p v-for="error in errors" class="text-red"> {{ error }}</p>
  </template>
  <VContainer v-else class="h-100">
    <VRow align="center" class="h-100">
      <VCol cols="2" style="border:solid 2px red">
        <BooksTableFilter
            v-if="tableStore.getFilters"
            :filters="tableStore.getFilters"
            @change="(key, value) => handleChangeFilter(key, value)"
        />
      </VCol>
      <VCol style="border: solid 2px red">
        <BooksTable
            :books="
            booksStore.filteredBooks(
              selectedFilter.type,
              selectedFilter.publisher,
              selectedFilter.status
            )
          "
            :headers="tableStore.getHeaders"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>

