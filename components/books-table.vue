<template>
  <VDataTable
    :loading="globalStore.getIsLoading"
    :headers="(props.headers as any)"
    :items="props.books"
    :search="search"
    no-data-text="No books found, please add one"
    height="70vh"
    fixed-header
    fixed-footer
  >
    <template v-slot:top>
      <VToolbar>
        <VTextField
          v-model="search"
          label="Search title"
          single-line
          hide-details
        />
        <VBtn
          color="primary"
          variant="tonal"
          @click="handleOpenDialogNewOrUpdateBook({ ...useEmptyBook().value })"
          >New Book</VBtn
        >
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
        readonly
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
            <VTextarea readonly v-model="(item as any).raw.comment"
          /></VListItem>
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
          >Are you sure you want to delete {{ bookToDelete.title }}</VCardTitle
        >
        <VCardActions class="justify-center">
          <VBtn
            color="success"
            variant="elevated"
            @click="handleCloseDialogDelete"
            >Go back</VBtn
          >
          <VBtn
            color="error"
            variant="outlined"
            @click="handleDeleteBook(bookToDelete.id)"
            >Delete</VBtn
          >
        </VCardActions>
      </VCard>
    </VContainer>
  </VDialog>
  <NewOrUpdateBook
    v-if="tableStore.getFilters"
    :open-modal="openBookModal"
    :book="bookToCreateOrUpdate"
    :table-filter="tableStore.getFilters"
    @create-new-book="(book) => handleCreateBook(book)"
    @update-book="(bookId) => handleUpdateBook(bookId)"
    @only-close="() => (openBookModal = false)"
  />
</template>

<script setup lang="ts">
import { TableHeaders } from "@prisma/client";
import { VDataTable } from "vuetify/labs/VDataTable";
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
const bookToDelete = useState(() => {
  return { ...useEmptyBook().value };
});
const bookToCreateOrUpdate = useState(() => {
  return { ...useEmptyBook().value };
});

//dialog
const deleteBookDialog = useState(() => false);
const openBookModal = useState(() => false);

//function
const handleCreateBook = async (book: IBook) => {
  openBookModal.value = false;
  try {
    globalStore.startLoading();
    await booksStore.createBook(book);
  } catch (error) {
    console.log(error);
  } finally {
    globalStore.stopLoading();
  }
};

const handleUpdateBook = async (book: IBook) => {
  openBookModal.value = false;
  try {
    globalStore.startLoading();
    await booksStore.updateBook(book);
  } catch (error) {
    console.log(error);
  } finally {
    globalStore.stopLoading();
  }
};

const handleDeleteBook = async (bookId: string) => {
  deleteBookDialog.value = false;
  try {
    globalStore.startLoading();
    await booksStore.removeBook(bookId);
  } catch (error) {
    console.log(error);
  } finally {
    bookToDelete.value = { ...useEmptyBook().value };
    globalStore.stopLoading();
  }
};

const handleOpenDialogNewOrUpdateBook = (book: IBook) => {
  bookToCreateOrUpdate.value = { ...book };
  openBookModal.value = true;
};
const handleOpenDialogDelete = (book: IBook) => {
  bookToDelete.value = book;
  deleteBookDialog.value = true;
};

const handleCloseDialogDelete = () => {
  deleteBookDialog.value = false;
  bookToDelete.value = { ...useEmptyBook().value };
};
</script>
