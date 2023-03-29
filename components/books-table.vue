<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import IBook from "~~/interface/book/book";
import ITableHeaders from "~~/interface/table/tableHeaders";
interface Props {
  books: IBook[];
  headers: ITableHeaders[];
  openBookModal: boolean;
  openDeleteBookModal: boolean;
}

const { headers, books, openBookModal, openDeleteBookModal } =
  defineProps<Props>();
const emit = defineEmits<{
  (e: "updateBookModal", value: boolean, book: IBook): void;
  (e: "updateDeleteBookModal", value: boolean, bookId: string): void;
}>()

const emptyBook: IBook = {
  id: "",
  title: "",
  buy: 0,
  read: 0,
  type: "Manga",
  status: "To Read",
  editor: "J-POP",
  price: 0,
  rating: 0,
  comment: "",
}
const search = useState(() => "");
</script>

<template>
  <VDataTable
    :headers="(headers as any)"
    :items="books"
    :search="search"
    height="70vh"
    fixed-header
    fixed-footer
  >
    <template v-slot:top>
      <VToolbar>
        <VToolbarTitle>Books</VToolbarTitle>
        <VTextField
          v-model="search"
          label="Search title"
          single-line
          hide-details
          class="search-bar-spacing"
        />
        <VBtn color="secondary" variant="tonal" @click="emit('updateBookModal', true, { ...emptyBook })">New Book</VBtn>
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
      <VBtn icon="mdi-comment-outline" color="primary" variant="tonal" />
    </template>
    <template v-slot:item.action="{ item }">
      <VBtnGroup>
        <VBtn icon="mdi-pencil" color="secondary" variant="tonal" @click="emit('updateBookModal', true, (item as any).raw)"/>
        <VBtn icon="mdi-delete" color="error" variant="tonal" />
      </VBtnGroup>
    </template>
  </VDataTable>
</template>

<style scoped>
.search-bar-spacing {
  margin-right: 25vw;
}
</style>
