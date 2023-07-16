import { Book } from "~/types/book";

export const useEmptyBook = () =>
  useState<Book>("empty-book", () => ({
    id: "",
    title: "",
    purchased: 1,
    read: 0,
    type: "Manga",
    status: "Plan To Read",
    publisher: "JPOP",
    price: 1,
    rating: 0,
    comment: "",
  }));
