<script setup lang="ts">

onMounted(async () => {
  try {
    globalStore.startLoading();
    await booksStore.fetchBooks();
    await tableStore.fetchBooksTableHeaders();
    await tableStore.fetchBooksTableFilters();
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
      if (error.value === "Unauthorized") {
        await useRouter().push("/login");
      }
    }
  } finally {
    globalStore.stopLoading();
  }
});


//state
const error = useState(() => "");
const selectedFilter = useState("selected-filter", () => {
  return {
    type: "All",
    editor: "All",
    status: "All",
  };
});

//store
const booksStore = useBooksStore();
const tableStore = useTableStore();
const globalStore = useGlobalStore();

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
  <div v-if="error">Error while loading the books: {{ error }}</div>
  <VContainer v-else class="h-100">
    <VRow align="center" class="h-100">
      <VCol cols="2">
        <BooksTableFilter
          v-if="tableStore.getFilters"
          :filters="tableStore.getFilters"
          @change="(key, value) => handleChangeFilter(key, value)"
        />
      </VCol>
      <VCol>
        <BooksTable
          :books="
            booksStore.filteredBooks(
              selectedFilter.type,
              selectedFilter.editor,
              selectedFilter.status
            )
          "
          :headers="tableStore.getHeaders"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>
