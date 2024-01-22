<script setup lang="ts">
import type { Book } from "~/types/book";
type Props = {
  book: Book;
};

type Emits = {
  openBookModal: [book: Book];
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const onOpenBookModal = () => {
  emits("openBookModal", props.book);
};
</script>

<template>
  <VCard elevation="24" hover link @click="onOpenBookModal">
    <VImg
      :src="props.book.image"
      :alt="`Copertina del ${props.book.type}: ${props.book.title}`"
    />
    <VCardTitle>{{ props.book.title }}</VCardTitle>
  </VCard>
</template>
