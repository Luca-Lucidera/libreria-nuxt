<script setup lang="ts">
import type { Book } from "~/types/book";
import { useEmptyBook } from "~/composables/empty-book";

type Props = {
  filters: string[];
};

const { filters } = defineProps<Props>();

//STORE
const globalStore = useGlobalStore();
const tableStore = useTableStore();
const booksStore = useBooksStore();

//state
const search = useState(() => "");
const bookToDelete = useState<Book>(() => ({ ...useEmptyBook().value }));
const bookToCreateOrUpdate = useState<Book>(() => ({
  ...useEmptyBook().value,
}));

//STATE DIALOG
const deleteBookDialog = useState(() => false);
const openBookModal = useState(() => false);

//CRUD BOOK
const handleCreateBook = async (book: Book) => {
  openBookModal.value = false;
  globalStore.startLoading();
  const result = await booksStore.createBook(book);

  if (!result.success) {
    globalStore.showSnackbar(result.errorData, "error");
  } else {
    globalStore.showSnackbar("Book created successfully", "success");
  }

  globalStore.stopLoading();
};

const handleUpdateBook = async (book: Book) => {
  openBookModal.value = false;
  globalStore.startLoading();
  const result = await booksStore.updateBook(book);
  if (!result.success) {
    globalStore.showSnackbar(result.errorData, "error");
  } else {
    globalStore.showSnackbar("Book updated successfully", "success");
  }
  globalStore.stopLoading();
};

const handleDeleteBook = async (bookId: string) => {
  globalStore.startLoading();
  const result = await booksStore.removeBook(bookId);
  if (!result.success) {
    globalStore.showSnackbar(result.errorData, "error");
  } else {
    handleCloseDialogDelete();
    globalStore.showSnackbar("Book deleted successfully", "success");
  }
  globalStore.stopLoading();
};

// DIALOG FUNCTION
const handleOpenDialogNewOrUpdateBook = (book: Book) => {
  bookToCreateOrUpdate.value = { ...book };
  openBookModal.value = true;
};

const handleOpenDialogDelete = (book: Book) => {
  bookToDelete.value = { ...book };
  deleteBookDialog.value = true;
};

const handleCloseDialogDelete = () => {
  deleteBookDialog.value = false;
  bookToDelete.value = { ...useEmptyBook().value };
};
</script>

<template>
  <VDataTable
    :loading="globalStore.isLoading"
    :headers="(tableStore.headers as any[])"
    :items="booksStore.filteredBooks(filters[0], filters[1], filters[2])"
    :search="search"
    loading-text="Caricamento..."
    no-data-text="No books found, please add one"
    height="65vh"
    fixed-header
    fixed-footer
    :items-per-page="booksStore.books.length > 15 ? 15 : booksStore.books.length"
    show-current-page
    hover
  >
    <template v-slot:top>
      <VToolbar density="comfortable">
        <VTextField
          v-model="search"
          label="Search title"
          single-line
          hide-details
          append-inner-icon="mdi-magnify"
          class="mr-16"
          clearable
        />
        <VBtn
          color="primary"
          variant="tonal"
          @click="handleOpenDialogNewOrUpdateBook({ ...useEmptyBook().value })"
          append-icon="mdi-plus"
          >New Book
        </VBtn>
      </VToolbar>
    </template>
    <template v-slot:item.price="{ value }"> {{ value }}€ </template>
    <template v-slot:item.rating="{ value }">
      <VRating
        v-model="(value as string)"
        :max="5"
        color="amber"
        half-increments
        :readonly="true"
      />
    </template>
    <template v-slot:item.comment="{ value }">
      <VMenu location="start">
        <template v-slot:activator="{ props }">
          <VBtn
            icon="mdi-comment-outline"
            color="primary"
            variant="tonal"
            v-bind="props"
          />
        </template>
        <VCard>
          <VListItem>
            <VTextarea :readonly="true" v-model="(value as string)" />
          </VListItem>
        </VCard>
      </VMenu>
    </template>
    <template v-slot:item.actions="{ item }">
      <VBtnGroup>
        <VBtn
          icon="mdi-pencil"
          color="secondary"
          variant="text"
          @click="handleOpenDialogNewOrUpdateBook(item)"
        />
        <VBtn
          color="error"
          icon="mdi-delete"
          variant="text"
          @click="handleOpenDialogDelete(item)"
        ></VBtn>
      </VBtnGroup>
    </template>
  </VDataTable>
  <!-- dialog section -->
  <VDialog v-model="deleteBookDialog">
    <VContainer class="h-screen d-flex justify-center align-center">
      <VCard class="w-25">
        <VCardTitle
          >Are you sure you want to delete {{ bookToDelete.title }}
        </VCardTitle>
        <VCardActions class="justify-center">
          <VBtn
            color="success"
            variant="elevated"
            @click="handleCloseDialogDelete"
            >Go back
          </VBtn>
          <VBtn
            color="error"
            variant="outlined"
            @click="handleDeleteBook(bookToDelete.id)"
            >Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VContainer>
  </VDialog>
  <NewOrUpdateBook
    v-if="tableStore.areFiltersReady"
    :open-modal="openBookModal"
    :book="bookToCreateOrUpdate"
    @create-new-book="(book) => handleCreateBook(book)"
    @update-book="(bookId) => handleUpdateBook(bookId)"
    @only-close="() => (openBookModal = false)"
  />
</template>
