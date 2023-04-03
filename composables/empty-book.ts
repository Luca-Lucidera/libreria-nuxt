export const useEmptyBook = () =>
  useState("empty-book", () => {
    return {
      id: "",
      title: "",
      purchased: 0,
      read: 0,
      type: "Manga",
      status: "Plan To Read",
      publisher: "JPOP",
      price: 0,
      rating: 0,
      comment: "",
    };
  });
