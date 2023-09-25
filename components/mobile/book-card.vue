<script setup lang="ts">
import type { Book } from "~/types/book";
type Props = {
  book: Book;
}
const { book } = defineProps<Props>();

const emits = defineEmits<{
  openModal: [book: Book];
  deleteBook: [book: Book];
}>();
</script>

<template>
  <VCard height="100%" hover class="d-flex flex-column">
    <VCardTitle>{{ book.title }}</VCardTitle>
    <VCardText class="d-flex flex-column justify-center py-0">
      <p>Purchased: {{ book.purchased }}</p>
      <p>Price: {{ book.price }}</p>
      <p>Publisher: {{ book.publisher }}</p>
    </VCardText>
    <VCardActions>
      <VBtn color="primary" @click="emits('openModal', book)">
        <VIcon>mdi-book-open-outline</VIcon>
      </VBtn>
      <VBtn color="error">
        <VIcon>mdi-delete</VIcon>
      </VBtn>
    </VCardActions>
  </VCard>
</template>
