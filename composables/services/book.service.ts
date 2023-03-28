import IBook from "~~/interface/book";

export const getBooks = async () => {
  try {
    return await $fetch<IBook[]>("/api/books", { credentials: "include" });
  } catch (error: any) {
    return handleErrorApi(error)
  }
}