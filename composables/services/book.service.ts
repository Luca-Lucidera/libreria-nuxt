import Book from "~~/interface/book";

export const getBooks = async () => {
  try {
    const books = await $fetch<Book[]>("/api/books", { credentials: "include" });
    return books
  } catch (error: any) {
    if (error.status !== 500) {
      throw new Error(error.statusMessage);
    }
    throw new Error("Something went wrong");
  }
}