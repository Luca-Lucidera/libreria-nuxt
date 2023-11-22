<script setup lang="ts">
definePageMeta({
  middleware: [
    () => {
      if (process.env.NODE_ENV === "production") {
        return "/";
      }
    },
  ],
});

const booksStore = useBooksStore();
const globalStore = useGlobalStore();

const chunkedBooks = computed(() => {
  const result = [];
  for (let i = 0; i < booksStore.books.length; i += 2) {
    result.push(booksStore.books.slice(i, i + 2));
  }
  return result;
});

onMounted(async () => {
  globalStore.startLoading();
  await booksStore.fetchBooks();
  console.log(booksStore.books);
  globalStore.stopLoading();
});
</script>

<template>
  <VContainer class="debug-container" v-if="booksStore.books.length > 0">
    <VRow
      class="debug-row"
      v-for="riga in chunkedBooks"
    >
      <VCol cols="6" class="debug-col" v-for="book in riga">
        <MobileBookCard :book="book" :test="true" />
      </VCol>
    </VRow>
  </VContainer>
</template>