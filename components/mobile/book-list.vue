<script setup lang="ts">
import type { Book } from "~/types/book";
import { useDisplay } from "vuetify";

//STORE
const booksStore = useBooksStore();
const globalStore = useGlobalStore();

//STATE
const containerHeight = useState(() => 500);
const container = ref(null as any);
const { height: screenHeight } = useDisplay();

const search = useState(() => "");

watchEffect(() => {
  containerHeight.value =
    screenHeight.value - container.value?.$el.getBoundingClientRect().y - 30;
});

const searchBooks = computed(() =>
  booksStore.books.filter((b) =>
    b.title.toLowerCase().includes(search.value.toLowerCase())
  )
);

const openBookModal = useState(() => false);
const clickedBook = useState<Book | null>(() => null);

const onOpenBookModal = (book: Book) => {
  clickedBook.value = { ...book };
  openBookModal.value = true
};

const onCloseBookModal = () => {
  clickedBook.value = null;
}
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
        <VCol
          v-for="book in searchBooks"
          cols="6"
          v-if="searchBooks.length !== 0"
        >
          <MobileBookCard :book="book" @open-book-modal="(book) => onOpenBookModal(book)" />
        </VCol>
        <VCol v-else>
          <p>No books found, switch to desktop interface to add a new one</p>
        </VCol>
      </VRow>
    </VContainer>
    <MobileBookModal
      v-if="clickedBook !== null"
      v-model="openBookModal"
      :book="clickedBook"
      @close-book-modal="onCloseBookModal"
    />
  </template>
</template>
