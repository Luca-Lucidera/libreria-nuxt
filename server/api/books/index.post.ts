import ICreateBook from "~~/interface/book/create-book";
import IUser from "~~/interface/user";

export default defineEventHandler(async (event) => {
  const { id: userId }: IUser = event.context.user;
  const bookToCreate = await readBody(event) as ICreateBook;
  if(!bookToCreate) {
    throw createError({ statusCode: 404, statusMessage: "Libro mancante" });
  }
  const editorId = await prisma.editor.findUnique({
    where: {
      name: bookToCreate.editor
    },
    select: {
      id: true
    }
  })
  const statusId = await prisma.statusBook.findUnique({
    where: {
      name: bookToCreate.status
    },
    select: {
      id: true
    }
  }) 
  const typeId = await prisma.bookType.findUnique({
    where: {
      name: bookToCreate.type
    },
    select: {
      id: true
    }
  })

  //check null 
  if(!editorId || !statusId || !typeId) {
    throw createError({
      statusCode: 400,
      statusMessage: "statusId | editorId | typeId non trovati",
    });
  }

  const book = await prisma.books.create({
    data: {
      title: bookToCreate.title,
      buy: bookToCreate.buy,
      read: bookToCreate.read,
      price: bookToCreate.price,
      rating: bookToCreate.rating,
      comment: bookToCreate.comment,
      userId: userId, 
      editorId: editorId.id,
      statusBookId: statusId.id,
      bookTypeId: typeId.id
    }
  });
  if(!book) {
    throw createError({ statusCode: 404, statusMessage: "Libro creato non trovato" });
  }
  return book;
});
