import Book from "~~/interface/book";
import { verifyJwt } from "../utils/jwt";
import { prisma } from "../utils/prisma";
import { getSessionValue } from "../utils/session";
export default defineEventHandler(async (event) => {
  const sessionJwt = getSessionValue(event);
  const userId = verifyJwt(sessionJwt);
  const user = await prisma.users.findFirst({
    where: {
      id: userId,
      jwt: sessionJwt,
    }
  });
  if(!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
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
    }
  });
  if (booksDB.length === 0) {
    return booksDB;
  }

  const books: Book[] = booksDB.map((book) => {
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
