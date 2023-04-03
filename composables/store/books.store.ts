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
    try {
      books.value = await getBooks();
    } catch (error) {
      throw error;
    }
  };

  const createBook = async (book: IBook) => {
    try {
      await postBook(book);
      await fetchBooks();
    } catch (error) {
      throw error;
    }
  };
  
  const updateBook = async (book: IBook) => {
    try {
      await putBook(book);
      await fetchBooks();
    } catch (error) {
      throw error;
    }
  };

  const removeBook = async (bookId: string) => {
    try {
      await deleteBook(bookId);
      await fetchBooks();
    } catch (error) {
      throw error;
    }
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
