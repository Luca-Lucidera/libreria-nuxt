import { Book, Publisher, Status, Type, User } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { id: userId }: User = event.context.user;

  const bookToUpdate = (await readBody(event)) as Book;
  if (
    !bookToUpdate ||
    !bookToUpdate.title ||
    !bookToUpdate.type ||
    !bookToUpdate.status ||
    !bookToUpdate.publisher
  ) {
    throw createError({ statusCode: 404, statusMessage: "Libro mancante" });
  }

  const parsedBook = {
    ...bookToUpdate,
    type: composePrismaEnum(bookToUpdate.type),
    status: composePrismaEnum(bookToUpdate.status),
    publisher: composePrismaEnum(bookToUpdate.publisher),
  };

  const status: Status = parsedBook.status as Status;
  const type: Type = parsedBook.type as Type;
  const publisher: Publisher = parsedBook.publisher as Publisher;
  if (!(status in Status) || !(type in Type) || !(publisher in Publisher)) {
    throw createError({
      statusCode: 400,
      statusMessage: "One field selected does not exist",
    });
  }

  const bookChanged = await prisma.book.update({
    where: {
      id: bookToUpdate.id,
    },
    data: {
      ...parsedBook,
      status,
      type,
      publisher,
      userId,
    },
  });
  return bookChanged;
});
