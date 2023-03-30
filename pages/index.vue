<script setup lang="ts">
import IBook from "~~/interface/book/book";

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
    globalStore.endLoading();
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

//dialog
const openBookModal = useState("open-book-modal", () => false);
const bookToCreateOrUpdate = { ...useEmptyBook() };

//store
const userStore = useUserStore();
const booksStore = useBooksStore();
const tableStore = useTableStore();
const globalStore = useGlobalStore();

const handleChangeFilter = (key: string, value: string) => {
  type filterKey = keyof typeof selectedFilter.value;
  const k: filterKey = key as filterKey;
  if (k in selectedFilter.value) {
    selectedFilter.value[k] = value;
  }
};

const handleNewOrChangeBookUpdate = (book: IBook) => {
  openBookModal.value = true;
  bookToCreateOrUpdate.value = { ...book };
};

const createBook = async (book: IBook) => {
  openBookModal.value = false;
  try {
    await booksStore.createBook(book);
  } catch (error) {}
};

const updateBook = async (book: IBook) => {
  openBookModal.value = false;
  try {
    await booksStore.updateBook(book);
  } catch (error) {}
};

const deleteBook = async (book: IBook) => {
  try {
    await booksStore.removeBook(book);
  } catch (error) {
    console.log(error);
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
          @update-book-modal="(book) => handleNewOrChangeBookUpdate(book)"
          @delete-book="(book) => deleteBook(book)"
        />
        <NewOrUpdateBook
          v-if="tableStore.getFilters"
          :open-modal="openBookModal"
          :book="bookToCreateOrUpdate"
          :status="tableStore.getFilters?.status!"
          :type="tableStore.getFilters?.type!"
          :editor="tableStore.getFilters?.editor!"
          @create-new-book="(book) => createBook(book)"
          @update-book="(bookId) => updateBook(bookId)"
          @only-close="($event) => (openBookModal = false)"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>
