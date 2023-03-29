<script setup lang="ts">
import { useBooksStore } from "~~/store/books.store";
import { useBooksTableStore } from "~~/store/table.store";
import { useUserStore } from "~~/store/user.store";

//page state
const router = useRouter();
const error = useState(() => "");
const isLoading = useState(() => true);
const selectedFilter = useState("selected-filter", () => {
  return {
    type: "All",
    editor: "All",
    status: "All",
    search: "",
  };
});

//store
const userStore = useUserStore();
const booksStore = useBooksStore();
const { fetchBooks, filteredBooks } = booksStore;
const booksTableStore = useBooksTableStore();
const { fetchBooksTableHeaders, fetchBooksTableFilters } = booksTableStore;

try {
  await fetchBooks();
  await fetchBooksTableHeaders();
  await fetchBooksTableFilters();
} catch (err) {
  if (err instanceof Error) {
    error.value = err.message;
  }
} finally {
  isLoading.value = false;
}

if (error.value === "Unauthorized") {
  router.push("/login");
}

function handleChangeFilter(key: string, value: string) {
  try {
    type filterKey = keyof typeof selectedFilter.value;
    const k: filterKey = key as filterKey;
    selectedFilter.value[k] = value;
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div>
    <div v-if="isLoading">
      <FullPageProgressBar />
    </div>
    <div v-else-if="error">Error while loading the books: {{ error }}</div>
    <div v-else>
      <VLayout class="page-height">
        <VAppBar elevation="12">
          <VAppBarNavIcon>
            <VBtn color="primary" icon="mdi-account-circle" />
          </VAppBarNavIcon>
          <VAppBarTitle
            >Your library {{ userStore.computedUser?.name }}</VAppBarTitle
          >
          <VBtn icon="mdi-logout" />
        </VAppBar>
        <VMain>
          <VContainer class="full-height">
            <VRow align="center" class="full-height">
              <VCol cols="2">
                <BooksTableFilter
                  v-if="booksTableStore.getFilters"
                  :filters="booksTableStore.getFilters"
                  @change="(key, value) => handleChangeFilter(key, value)"
                />
              </VCol>
              <VCol>
                <BooksTable
                  :books="
                    filteredBooks(
                      selectedFilter.type,
                      selectedFilter.editor,
                      selectedFilter.status
                    )
                  "
                  :headers="booksTableStore.getHeaders"
                />
              </VCol>
            </VRow>
          </VContainer>
        </VMain>
      </VLayout>
    </div>
  </div>
</template>
<style scoped>
.page-height {
  height: 100vh;
}
.full-height {
  height: 100%;
}
</style>
