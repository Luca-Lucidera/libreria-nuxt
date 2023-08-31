<script setup lang="ts">
import { useDisplay } from "vuetify/lib/framework.mjs";

const booksStore = useBooksStore();
const globalStore = useGlobalStore();
const containerHeight = useState(() => 500);
const { height: screenHeight } = useDisplay();
const container = ref(null as any);
const search = useState(() => "");
watchEffect(() => {
  containerHeight.value =
    screenHeight.value - container.value?.$el.getBoundingClientRect().y - 50;
});
</script>

<template>
  <template v-if="!globalStore.getIsLoading && booksStore.books.length == 0">
    <p>No books found</p>
  </template>
  <template v-else>
    <VRow class="px-5">
      <VTextField
        v-model="search"
        color="primary"
        placeholder="Title..."
        variant="underlined"
      />
    </VRow>
    <VContainer
      class="mt-4 overflow-y-auto"
      ref="container"
      :style="{
        height: containerHeight + 'px',
      }"
    >
      <VRow>
        <VCol v-for="book in booksStore.computedBooks" cols="6">
          <VCard>
            <VCardTitle class="text-center">{{ book.title }}</VCardTitle>
            <VCardText>
              <p>purchased: {{ book.purchased }}</p>
              <p>publisher: {{ book.publisher }}</p>
              <p>price: {{ book.price }} €</p>
            </VCardText>
            <VCardActions class="justify-space-around">
              <VBtn color="primary" variant="tonal">
                <VIcon>mdi-book-open</VIcon>
              </VBtn>
              <VBtn color="error" variant="tonal">
                <VIcon>mdi-delete</VIcon>
              </VBtn>
            </VCardActions>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </template>
</template>
