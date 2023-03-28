import IUser from "~/interface/user";
import IBook from "~~/interface/book";

export default defineEventHandler(async (event) => {
  const { id: userId }: IUser = event.context.user;
  const booksDB = await prisma.books.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      title: "asc",
    },
    include: {
      bookType: true,
      editor: true,
      statusBook: true,
    },
  });
  if (booksDB.length === 0) {
    return booksDB;
  }
  const books: IBook[] = booksDB.map((book) => {
    return {
      id: book.id,
      title: book.title,
      buy: book.buy,
      read: book.read,
      type: book.bookType.name,
      status: book.statusBook.name,
      editor: book.editor.name,
      price: book.price,
      rating: book.rating,
      comments: book.comments,
    };
  });
  return books;
});
