<script setup lang="ts">
import type { Book } from "~/types/book";
import { useDisplay } from "vuetify";

const booksStore = useBooksStore();
const globalStore = useGlobalStore();
const containerHeight = useState(() => 500);
const { height: screenHeight } = useDisplay();
const container = ref(null as any);
const search = useState(() => "");
watchEffect(() => {
  containerHeight.value =
    screenHeight.value - container.value?.$el.getBoundingClientRect().y - 30;
});

const modal = useState(() => false);

const bookToShow = useState<Book | null>(() => null);

const openModal = (book: Book) => {
  modal.value = true;
  bookToShow.value = { ...book };
};

const closeModal = () => {
  modal.value = false;
  bookToShow.value = null;
};
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
      :style="{ height: containerHeight + 'px' }"
    >
      <VRow>
        <VCol v-for="book in booksStore.computedBooks" cols="6">
          <MobileBookCard
            :book="book"
            @open-modal="(book) => openModal(book)"
          />
        </VCol>
      </VRow>
    </VContainer>

    <MobileBookModal
      v-if="bookToShow"
      :book="bookToShow"
      :open-modal="modal"
      @close-modal="(value) => (modal = value)"
      @create-book="(book) => {}"
      @update-book="(book) => {}"
    />
  </template>
</template>
