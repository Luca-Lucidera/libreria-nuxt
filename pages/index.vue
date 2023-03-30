<script setup lang="ts">
import IBook from "~~/interface/book/book";

//page state
const router = useRouter();
const error = useState(() => "");
const isLoading = useState(() => true);
const selectedFilter = useState("selected-filter", () => {
  return {
    type: "All",
    editor: "All",
    status: "All",
  };
});
const openBookModal = useState("open-book-modal", () => false);
const bookToCreateOrUpdate = useState("book-to-create-or-update", () => {
  return {
    id: "",
    title: "",
    buy: 0,
    read: 0,
    type: "Manga",
    status: "To read",
    editor: "J-POP",
    price: 0,
    rating: 0,
    comment: "",
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
  await router.push("/login");
}

function handleChangeFilter(key: string, value: string) {
  try {
    type filterKey = keyof typeof selectedFilter.value;
    const k: filterKey = key as filterKey;
    selectedFilter.value[k] = value;
  } catch (error) {}
}

function handleNewOrChangeBookUpdate(book: IBook) {
  openBookModal.value = true;
  bookToCreateOrUpdate.value = { ...book };
}


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

const handleLogout = async () => {
  try {
    await userStore.endSession();
    await router.push("/login");
  } catch (error) {}
};
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
          <VBtn icon="mdi-logout" @click="handleLogout" />
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
                  @update-book-modal="
                    (book) => handleNewOrChangeBookUpdate(book)
                  "
                  @delete-book="(book) => deleteBook(book)"
                />
                <NewOrUpdateBook
                  v-if="booksTableStore.getFilters"
                  :open-modal="openBookModal"
                  :book="bookToCreateOrUpdate"
                  :status="booksTableStore.getFilters?.status!"
                  :type="booksTableStore.getFilters?.type!"
                  :editor="booksTableStore.getFilters?.editor!"
                  @create-new-book="(book) => createBook(book)"
                  @update-book="(bookId) => updateBook(bookId)"
                  @only-close="($event) => (openBookModal = false)"
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
