<script setup lang="ts">
import { VForm } from "vuetify/lib/components/index.mjs";
import { useDisplay } from "vuetify";
import { BookToBuy } from "types/bookToBuy";

//state
const errors = useState<string[]>(() => []);

//store
const tableStore = useTableStore();
const globalStore = useGlobalStore();
const booksStore = useBooksStore();

const tab = ref(null);

onMounted(async () => {
  globalStore.startLoading();

  const resultFilters = await tableStore.fetchBooksTableFilters();
  if (!resultFilters.success) {
    if (resultFilters.errorData) {
      errors.value.push(resultFilters.errorData);
    }
  }

  const resultHeaders = await tableStore.fetchBooksTableHeaders();
  if (!resultHeaders.success) {
    if (resultHeaders.errorData) {
      errors.value.push(resultHeaders.errorData);
    }
  }

  const resultBooks = await booksStore.fetchBooks();
  if (!resultBooks.success) {
    if (resultBooks.errorData) {
      errors.value.push(resultBooks.errorData);
    }
  }

  globalStore.stopLoading();
});
</script>

<template>
  <template v-if="errors.length != 0">
    <p v-for="error in errors" class="text-red">{{ error }}</p>
  </template>
  <VContainer v-else class="h-100">
    <VTabs v-model="tab" align-tabs="center" class="mb-8">
      <VTab value="home">
        <VIcon>mdi-home</VIcon>
        Home
      </VTab>
      <VTab value="next-to-buy">
        <VIcon>mdi-book</VIcon>
        Next to buy
      </VTab>
    </VTabs>
    <VWindow v-model="tab">
      <VWindowItem value="home">
        <HomePageTable v-if="!useDisplay().mobile.value" />
        <MobileBookList v-else />
      </VWindowItem>
      <VWindowItem value="next-to-buy">
        <NextToBuy />
      </VWindowItem>
    </VWindow>
  </VContainer>
</template>
