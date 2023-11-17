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

const searchBooks = computed(() =>
  booksStore.books.filter((b) =>
    b.title.toLowerCase().includes(search.value.toLowerCase())
  )
);
</script>

<template>
  <template v-if="!globalStore.isLoading && booksStore.books.length == 0">
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
        <VCol v-for="book in searchBooks" cols="6" v-if="searchBooks.length !== 0">
          <MobileBookCard
            :book="book"
            @open-modal="(book) => openModal(book)"
          />
        </VCol>
        <VCol v-else>
          <p>No books found, switch to desktop interface to add a new one</p>

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
