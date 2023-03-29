import IBook from "~~/interface/book/book";

export const getBooks = async () => {
  try {
    return await $fetch<IBook[]>("/api/books", { credentials: "include" });
  } catch (error: any) {
    return handleErrorApi(error)
  }
}

export const postBook = async (book: IBook) => {
  const { id, ...bookWithoutId } = book;
  try {
    return await $fetch<IBook>("/api/books", {
      method: "POST",
      body: JSON.stringify(bookWithoutId),
      credentials: "include",
    });
  } catch (error: any) {
    return handleErrorApi(error)
  }
}

export const putBook = async (book: IBook) => {
  try {
    return await $fetch<IBook>(`/api/books`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(book),
    });
  } catch (error: any) {
    return handleErrorApi(error)
  }
}