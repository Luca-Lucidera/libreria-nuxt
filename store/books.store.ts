import { defineStore } from "pinia";
import IBook from "~~/interface/book/book";

export const useBooksStore = defineStore("books", () => {
  const books = ref<IBook[]>([]);

  const computedBooks = computed(() => books.value);

  const filteredBooks = (type: string, editor: string, status: string) =>
    computed(() => {
      if (type === "All" && editor === "All" && status === "All") {
        return books.value;
      }
      return books.value.filter((book) => {
        if (type !== "All" && book.type !== type) return false;
        if (editor !== "All" && book.editor !== editor) return false;
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

  const removeBook = async (book: IBook) => {
    try {
      await deleteBook(book);
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
