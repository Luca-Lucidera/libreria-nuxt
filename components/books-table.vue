<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import IBook from "~~/interface/book/book";
import ITableHeaders from "~~/interface/table/tableHeaders";
interface Props {
  books: IBook[];
  headers: ITableHeaders[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "updateBookModal", book: IBook): void;
  (e: "deleteBook", book: IBook): void;
}>();

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
};
const search = useState(() => "");
</script>

<template>
  <VDataTable
    :headers="(props.headers as any)"
    :items="props.books"
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
        <VBtn
          color="secondary"
          variant="tonal"
          @click="emit('updateBookModal', { ...emptyBook })"
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
    <template v-slot:item.action="{ item }">
      <VBtnGroup>
        <VBtn
          icon="mdi-pencil"
          color="secondary"
          variant="tonal"
          @click="emit('updateBookModal', (item as any).raw)"
        />

        <VDialog width="auto" height="auto">
          <template v-slot:activator="{ props }">
            <VBtn
              icon="mdi-delete"
              color="error"
              variant="tonal"
              v-bind="props"
            />
          </template>
          <VCard>
            <VCardTitle>Sicuro di voler eliminare {{ (item as any).raw.title }}?</VCardTitle>
            <VCardActions class="justify-center my-5">
              <VBtn color="green" variant="elevated">Torna indietro</VBtn>
              <VBtn color="red" variant="outlined" @click="$emit('deleteBook', (item as any).raw)">Elimina</VBtn>
              <!-- torna indietro __ -->
            </VCardActions>
          </VCard>
        </VDialog>
      </VBtnGroup>
    </template>
  </VDataTable>
</template>

<style scoped>
.search-bar-spacing {
  margin-right: 25vw;
}
</style>
