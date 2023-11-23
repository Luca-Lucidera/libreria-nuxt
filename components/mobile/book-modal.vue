<script setup lang="ts">
import type { Book } from "~/types/book";
type Props = {
  book: Book;
  openModal: boolean;
  test: boolean;
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
  <VDialog
    v-if="!props.test"
    v-model="open"
    @update:model-value="emits('closeModal', false)"
  >
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
  <VDialog v-else v-model="open" fullscreen scrollable>
    <VCard>
      <VCardTitle>
        <VRow>
          <VCol cols="auto">
            <VBtn variant="text" icon="mdi-arrow-left-circle" color="primary" />
          </VCol>
          <VCol align-self="center"> {{ props.book.title }}</VCol>
        </VRow>
      </VCardTitle>
      <VContainer style="border: solid red 2px">
        <VRow>
          <VInput />
        </VRow>
      </VContainer>
      <VCardActions>
        <VBtn>Modifica<VIcon>mdi-pencil</VIcon></VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>
.debug {
  border: 2px solid red;
}
</style>
