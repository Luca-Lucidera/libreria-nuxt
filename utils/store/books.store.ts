import {defineStore} from "pinia";
import {Book} from "~/types/book";
import {FetchError} from "ofetch";
import {Result} from "~/types/result";

export const useBooksStore= defineStore("books", () => {
  const globalStore = useGlobalStore();

  const books = ref<Book[]>([]);
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

  const fetchBooks = async (): Promise<Result<void, string>> => {
    try {
      books.value = await $fetch<Book[]>("/api/books", {
        method: "GET",
        credentials: "include",
        headers: {
          "Authorization": globalStore.computedJwt ? `Bearer ${globalStore.computedJwt}` : ""
        }
      });
      return {
        success: true
      }
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(`Errore in books.store.ts fetchBooks(), DATA: ${error.data}, statusCode: ${error.statusCode}, statusMessage: ${error.statusMessage}`)
        return {
          success: false,
          errorData: error.statusMessage
        }
      }
      console.error(`Errore non gestito books.store.ts fetchBooks() ${JSON.stringify(error, null, 4)}`)
      return {
        success: false,
        errorData: "Errore non gestito nel prendere i libri, riprovare più darti"
      }
    }
  };

  const createBook = async (book: Book) => {
    try {
      await $fetch("/api/books", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(book),
        headers: {
          Authorization: globalStore.computedJwt
            ? `Bearer ${globalStore.computedJwt}`
            : "",
        },
      });
      await fetchBooks();
    } catch (ex: any) {
      //ex è di tipo NuxtError
      throw ex;
    }
  };

  const updateBook = async (book: Book) => {
    try {
      await $fetch("/api/books", {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(book),
        headers: {
          Authorization: globalStore.computedJwt
            ? `Bearer ${globalStore.computedJwt}`
            : "",
        },
      });
      await fetchBooks();
    } catch (error) {
      throw error;
    }
  };

  const removeBook = async (bookId: string) => {
    try {
      await $fetch(`/api/books/${bookId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: globalStore.computedJwt
            ? `Bearer ${globalStore.computedJwt}`
            : "",
        },
      });
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
