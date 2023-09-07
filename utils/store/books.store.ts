import { defineStore } from "pinia";
import { Book } from "~/types/book";
import { FetchError } from "ofetch";
import { Result } from "~/types/result";
import { BookToBuy } from "types/book/bookToBuy";

export const useBooksStore = defineStore("books", () => {
  const globalStore = useGlobalStore();

  const books = ref<Book[]>([]);
  const computedBooks = computed(() => books.value);

  const filteredBooks = (type: string, status: string, publisher: string) => {
    if (type === "All" && publisher === "All" && status === "All") {
      return books.value;
    }

    return books.value.filter((book) => {
      if (type !== "All" && book.type !== type) return false;
      if (publisher !== "All" && book.publisher !== publisher) return false;
      return !(status !== "All" && book.status !== status);
    });
  };

  const fetchBooks = async (): Promise<Result<void, string>> => {
    try {
      books.value = await $fetch<Book[]>("/api/books", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: globalStore.computedJwt
            ? `Bearer ${globalStore.computedJwt}`
            : "",
        },
      });
      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(
          `Errore in books.store.ts fetchBooks(), DATA: ${error.data}, statusCode: ${error.statusCode}, statusMessage: ${error.statusMessage}`
        );
        return {
          success: false,
          errorData: error.statusMessage,
        };
      }
      console.error(
        `Errore non gestito books.store.ts fetchBooks() ${JSON.stringify(
          error,
          null,
          4
        )}`
      );
      return {
        success: false,
        errorData:
          "Errore non gestito nel prendere i libri, riprovare più darti",
      };
    }
  };

  const createBook = async (book: Book): Promise<Result<void, string>> => {
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
      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(
          `Errore in books.store.ts createBook(), DATA: ${error.data}, statusCode: ${error.statusCode}, statusMessage: ${error.statusMessage}`
        );
        return {
          success: false,
          errorData: error.statusMessage,
        };
      }
      console.error(
        `Errore non gestito books.store.ts createBook() ${JSON.stringify(
          error,
          null,
          4
        )}`
      );
      return {
        success: false,
        errorData:
          "Errore non gestito nel creare i; libro, riprovare più darti",
      };
    }
  };

  const updateBook = async (book: Book): Promise<Result<void, string>> => {
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
      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(
          `Errore in books.store.ts updateBook(), DATA: ${error.data}, statusCode: ${error.statusCode}, statusMessage: ${error.statusMessage}`
        );
        return {
          success: false,
          errorData: error.statusMessage,
        };
      }
      console.error(
        `Errore non gestito books.store.ts updateBook() ${JSON.stringify(
          error,
          null,
          4
        )}`
      );
      return {
        success: false,
        errorData:
          "Errore non gestito nel modificare il libro, riprovare più darti",
      };
    }
  };

  const removeBook = async (bookId: string): Promise<Result<void, string>> => {
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
      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(
          `Errore in books.store.ts removeBook(), DATA: ${error.data}, statusCode: ${error.statusCode}, statusMessage: ${error.statusMessage}`
        );
        return {
          success: false,
          errorData: error.statusMessage,
        };
      }
      console.error(
        `Errore non gestito books.store.ts removeBook() ${JSON.stringify(
          error,
          null,
          4
        )}`
      );
      return {
        success: false,
        errorData:
          "Errore non gestito nell'eliminare il libro, riprovare più darti",
      };
    }
  };

  const fetchBooksToBuy = async (): Promise<Result<BookToBuy[], string>> => {
    try {
      const data = await $fetch<BookToBuy[]>("/api/books/to-buy", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: globalStore.computedJwt
            ? `Bearer ${globalStore.computedJwt}`
            : "",
        },
      });
      return {
        success: true,
        successData: data,
      };
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(
          `Errore in books.store.ts fetchBooksToBuy(), DATA: ${error.data}, statusCode: ${error.statusCode}, statusMessage: ${error.statusMessage}`
        );
        return {
          success: false,
          errorData: error.statusMessage,
        };
      }
      console.error(
        `Errore non gestito books.store.ts fetchBooksToBuy() ${JSON.stringify(
          error,
          null,
          4
        )}`
      );
      return {
        success: false,
        errorData:
          "Errore non gestito nel prendere i libri da comprare, riprovare più darti",
      };
    }
  };

  const addBooksToBuy = async (
    books: BookToBuy[]
  ): Promise<Result<boolean, string>> => {
    try {
      const { success, duplicate } = await $fetch<{success: boolean, duplicate: boolean}>("/api/books/to-buy", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(books),
        headers: {
          Authorization: globalStore.computedJwt
            ? `Bearer ${globalStore.computedJwt}`
            : "",
        },
      });

      return {
        success,
        successData: duplicate,
      };
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(
          `Errore in books.store.ts addBooksToBuy(), DATA: ${error.data}, statusCode: ${error.statusCode}, statusMessage: ${error.statusMessage}`
        );
        return {
          success: false,
          errorData: error.statusMessage,
        };
      }
      console.error(
        `Errore non gestito books.store.ts addBooksToBuy() ${JSON.stringify(
          error,
          null,
          4
        )}`
      );
      return {
        success: false,
        errorData:
          "Errore non gestito nell'aggiungere i libri da comprare, riprovare più darti",
      };
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
    fetchBooksToBuy,
    addBooksToBuy,
  };
});
