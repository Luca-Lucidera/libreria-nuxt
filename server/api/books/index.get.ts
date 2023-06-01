import { User } from "@prisma/client";
import IBook from "~/interface/book/book";

export default defineEventHandler(async (event) => {
  const result = await handleSecurity(event);
  if (!result.success) {
    throw createError({ statusCode: 401, statusMessage: result.errorData });
  }
  if(!result.successData?.user?.id){
    throw createError({ statusCode: 401, statusMessage: "Token invalid" });
  }
  const userBooks = await prisma.book.findMany({
    where: {
      userId: result.successData.user.id,
    },
    select: {
      id: true,
      title: true,
      purchased: true,
      read: true,
      type: true,
      status: true,
      publisher: true,
      price: true,
      rating: true,
      comment: true,
    },
  });

  if (userBooks.length === 0) {
    return userBooks;
  }

  const books: IBook[] = userBooks.map((book) => {
    return {
      id: book.id,
      title: book.title,
      purchased: book.purchased,
      read: book.read,
      type: parsePrismaEnum(book.type),
      status: parsePrismaEnum(book.status),
      publisher: parsePrismaEnum(book.publisher),
      price: book.price,
      rating: book.rating,
      comment: book.comment,
    };
  });
  return books;
});
