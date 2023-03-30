export const emptyBook = useState("empty-book", () => {
  return {
    id: "",
    title: "",
    buy: 0,
    read: 0,
    type: "Manga",
    status: "To read",
    editor: "J-POP",
    price: 0,
    rating: 0,
    comment: "",
  };
});
