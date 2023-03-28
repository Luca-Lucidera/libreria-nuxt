import { defineStore } from "pinia";
import IBook from "~~/interface/book";

export const useBooksStore = defineStore("books", () => {
  const books = ref<IBook[]>([]);
  const computedBooks = computed(() => books.value);

  const fetchBooks = async () => {
    try {
      books.value = await getBooks();  
    } catch (error) {
      throw error;
    }
    
  }

  return {
    books,
    computedBooks,
    fetchBooks,
  };
});
