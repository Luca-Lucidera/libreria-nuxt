<script setup lang="ts">
import type { Book } from "~/types/book";
type Props = {
  book: Book;
  test: boolean;
};
const { book, test } = defineProps<Props>();
const emits = defineEmits<{
  openModal: [book: Book];
  deleteBook: [book: Book];
}>();
</script>

<template>
  <VCard height="100%" hover class="d-flex flex-column" v-if="!test">
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
  <VCard v-else elevation="24" hover link @click="emits('openModal', book)">
    <VImg
      :src="book.image"
      :alt="`Copertina del ${book.type}: ${book.title}`"
    />
    <VCardTitle>{{ book.title }}</VCardTitle>
  </VCard>
</template>

<style scoped>
.debug {
  border: 1px solid red;
}
</style>
