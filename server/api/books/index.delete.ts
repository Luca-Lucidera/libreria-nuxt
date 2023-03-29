import IBook from "~~/interface/book/book";

export default defineEventHandler(async (event) => {
  const book = (await readBody(event)) as IBook;
  if (!book) {
    return createError({ statusCode: 400, statusMessage: "Bad Request" });
  }
  await prisma.books.delete({
    where: {
      id: book.id,
    },
  })
  return "OK";
});
