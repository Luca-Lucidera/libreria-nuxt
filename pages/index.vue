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

<script setup lang="ts">
import { FetchError } from "ofetch";

//state
const error = useState(() => "");
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
  try {
    globalStore.startLoading();
    await tableStore.fetchBooksTableFilters();
    await tableStore.fetchBooksTableHeaders();
    await booksStore.fetchBooks();
  } catch (e: any) {
    const err: FetchError = e;
    if (err.statusCode != 500) {
      if (err.statusMessage) {
        error.value = err.statusMessage;
      } else {
        error.value =
          "Not a fatal error, but we can't find the problem, please contact luca-lucidera on github";
      }
    } else {
      error.value = "Something went wrong";
    }
  } finally {
    globalStore.stopLoading();
  }
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
