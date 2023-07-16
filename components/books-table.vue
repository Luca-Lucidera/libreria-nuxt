<script setup lang="ts">
import {TableHeaders} from "@prisma/client";
import {VDataTable} from "vuetify/labs/VDataTable";
import {Book} from "~/types/book";
import {useEmptyBook} from "~/composables/empty-book";

interface Props {
  books: Book[];
  headers: TableHeaders[];
}

const props = defineProps<Props>();

const globalStore = useGlobalStore();
const tableStore = useTableStore();
const booksStore = useBooksStore();

//state
const search = useState(() => "");
const bookToDelete = useState<Book>(() => ({...useEmptyBook().value}))
const bookToCreateOrUpdate = useState<Book>(() => ({...useEmptyBook().value}))

//dialog
const deleteBookDialog = useState(() => false);
const openBookModal = useState(() => false);

//function
const handleCreateBook = async (book: Book) => {
  openBookModal.value = false;
  globalStore.startLoading();
  const result = await booksStore.createBook(book);
  if (!result.success) {
    alert(result?.errorData)
  }
  globalStore.stopLoading();
};
const handleUpdateBook = async (book: Book) => {
  openBookModal.value = false;
  globalStore.startLoading();
  const result = await booksStore.updateBook(book);
  if (!result.success) {
    alert(result.errorData)
  }
  globalStore.stopLoading();
}
const handleDeleteBook = async (bookId: string) => {
  globalStore.startLoading();
  const result = await booksStore.removeBook(bookId);
  if (result.success) {
    handleCloseDialogDelete();
  } else {
    alert(result.errorData)
  }
  globalStore.stopLoading();
}

const handleOpenDialogNewOrUpdateBook = (book: Book) => {
  bookToCreateOrUpdate.value = {...book};
  openBookModal.value = true;
};
const handleOpenDialogDelete = (book: Book) => {
  bookToDelete.value = {...book};
  deleteBookDialog.value = true;
};

const handleCloseDialogDelete = () => {
  deleteBookDialog.value = false;
  bookToDelete.value = {...useEmptyBook().value};
};
</script>

<template>
  <VDataTable
      :loading="globalStore.getIsLoading"
      :headers="props.headers"
      :items="props.books"
      :search="search"
      loading-text="Caricamento..."
      no-data-text="No books found, please add one"
      height="70vh"
      fixed-header
      fixed-footer
      items-per-page="-1"
      show-current-page
  >
    <template v-slot:top>
      <VToolbar>
        <VTextField
            v-model="search"
            label="Search title"
            single-line
            hide-details
            append-inner-icon="mdi-magnify"
            class="mr-16"
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
    <template v-slot:item.price="{ item }">
      {{ (item as any).raw.price }} €
    </template>
    <template v-slot:item.rating="{ item }">
      <VRating
          v-model="(item as any).raw.rating"
          :max="5"
          color="amber"
          half-increments
          :readonly="true"
      />
    </template>
    <template v-slot:item.comment="{ item }">
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
            <VTextarea :readonly="true" v-model="(item as any).raw.comment"
            />
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
            @click="handleOpenDialogNewOrUpdateBook((item as any).raw)"
        />
        <VBtn
            color="error"
            icon="mdi-delete"
            variant="text"
            @click="handleOpenDialogDelete((item as any).raw)"
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
        </VCardTitle
        >
        <VCardActions class="justify-center">
          <VBtn
              color="success"
              variant="elevated"
              @click="handleCloseDialogDelete"
          >Go back
          </VBtn
          >
          <VBtn
              color="error"
              variant="outlined"
              @click="handleDeleteBook(bookToDelete.id)"
          >Delete
          </VBtn
          >
        </VCardActions>
      </VCard>
    </VContainer>
  </VDialog>
  <NewOrUpdateBook
      v-if="tableStore.getFilters"
      :open-modal="openBookModal"
      :book="bookToCreateOrUpdate"
      @create-new-book="(book) => handleCreateBook(book)"
      @update-book="(bookId) => handleUpdateBook(bookId)"
      @only-close="() => (openBookModal = false)"
  />
</template>