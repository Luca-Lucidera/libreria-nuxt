import IBook from "~~/interface/book/book";

export default defineEventHandler(async (event) => {
  const bookBody = (await readBody(event)) as IBook;
  if (!bookBody) {
    throw createError({
      statusCode: 400,
      statusMessage: "Book id is required",
    });
  }
  const editorId = await prisma.editor.findUnique({
    where: {
      name: bookBody.editor,
    },
    select: {
      id: true,
    },
  });
  const statusId = await prisma.statusBook.findUnique({
    where: {
      name: bookBody.status,
    },
    select: {
      id: true,
    },
  });
  const typeId = await prisma.bookType.findUnique({
    where: {
      name: bookBody.type,
    },
    select: {
      id: true,
    },
  });

  if (!editorId || !statusId || !typeId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad request",
    });
  }
  const bookChanged = await prisma.books.update({
    where: {
      id: bookBody.id,
    },
    data: {
      title: bookBody.title,
      buy: bookBody.buy,
      read: bookBody.read,
      price: bookBody.price,
      rating: bookBody.rating,
      comment: bookBody.comment,
      editorId: editorId.id,
      statusBookId: statusId.id,
      bookTypeId: typeId.id,
    },
  });
  return bookChanged;
});
