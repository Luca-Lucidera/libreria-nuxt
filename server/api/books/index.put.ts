import { Publisher, Status, Type } from "@prisma/client";
import type { Book } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const result = await handleSecurity(event);
  if (!result.success) {
    throw createError({ statusCode: 401, statusMessage: result.errorData });
  }
  if (!result.successData?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: "Token invalid" });
  }

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
      userId: result.successData.user.id,
    },
  });
  return bookChanged;
});
