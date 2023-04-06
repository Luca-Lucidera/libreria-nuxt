import { defineStore } from "pinia";
import IBook from "~~/interface/book/book";

export const useBooksStore = defineStore("books", () => {
  const books = ref<IBook[]>([]);

  const computedBooks = computed(() => books.value);

  const filteredBooks = (type: string, publisher: string, status: string) =>
    computed(() => {
      if (type === "All" && publisher === "All" && status === "All") {
        return books.value;
      }
      return books.value.filter((book) => {
        if (type !== "All" && book.type !== type) return false;
        if (publisher !== "All" && book.publisher !== publisher) return false;
        if (status !== "All" && book.status !== status) return false;
        return true;
      });
    }).value;

  const fetchBooks = async () => {
    const { data, error } = await useLazyFetch("/api/books", {
      method: "GET",
      credentials: "include",
    });
    if (error.value) {
      throw error.value;
    }
    if (data.value) {
      books.value = data.value;
    }
  };

  const createBook = async (book: IBook) => {
    const { error } = await useLazyFetch("/api/books", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(book),
    });
    if (error.value) {
      throw error.value;
    }
    await fetchBooks();
  };

  const updateBook = async (book: IBook) => {
    const { error } = await useLazyFetch("/api/books", {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(book),
    });
    if (error.value) {
      throw error.value;
    }
    await fetchBooks();
  };

  const removeBook = async (bookId: string) => {
    const { error } = await useLazyFetch(`/api/books/${bookId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (error.value) {
      throw error.value;
    }
    await fetchBooks();
  };

  return {
    books,
    computedBooks,
    filteredBooks,
    fetchBooks,
    createBook,
    updateBook,
    removeBook,
  };
});
