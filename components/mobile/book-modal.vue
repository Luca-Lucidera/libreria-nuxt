<script setup lang="ts">
import type { Book } from "~/types/book";
type Props = {
  book: Book;
  openModal: boolean;
};

type Emits = {
  closeModal: [value: boolean];
  updateBook: [book: Book];
  createBook: [book: Book];
};

const props = defineProps<Props>();

const colors = [
  "#03a9f4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#e91e63",
  "#00bcd4",
];

const emits = defineEmits<Emits>();

const open = computed(() => props.openModal);
</script>

<template>
  <VDialog v-model="open" @update:model-value="emits('closeModal', false)">
    <VCard>
      <VCardTitle>{{ props.book.title }}</VCardTitle>
      <VCardText>
        <VTimeline density="compact" side="end" truncate-line="both">
          <template v-for="(item, key, i) in props.book">
            <VTimelineItem
              v-if="key !== 'id' && key !== 'title' && key !== 'image'"
              size="x-small"
              :key="i"
              line-inset="6"
              :dot-color="colors.at(i)"
            >
            <!-- make key first letter upper case -->
              {{ key.charAt(0).toUpperCase() + key.slice(1) }}: {{ item }}
            </VTimelineItem>
          </template>
        </VTimeline>
      </VCardText>
      <VCardActions class="justify-center">
        <VBtn
          @click="emits('closeModal', false)"
          size="x-large"
          color="primary"
        >
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
