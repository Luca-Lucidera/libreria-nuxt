import { Publisher, Status, Type } from "@prisma/client";
import type { Book } from "@prisma/client"

export default defineEventHandler(async (event) => {
  const result = await handleSecurity(event);
  if (!result.success) {
    throw createError({ statusCode: 401, statusMessage: result.errorData });
  }
  if (!result.successData?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: "Token invalid" });
  }

  const { id, ...bookToCreate } = (await readBody(event)) as Book;
  if (
    !bookToCreate ||
    !bookToCreate.title ||
    !bookToCreate.type ||
    !bookToCreate.status ||
    !bookToCreate.publisher
  ) {
    throw createError({ statusCode: 404, statusMessage: "Libro mancante" });
  }
  const parsedBook = {
    ...bookToCreate,
    type: composePrismaEnum(bookToCreate.type),
    status: composePrismaEnum(bookToCreate.status),
    publisher: composePrismaEnum(bookToCreate.publisher),
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
  const book = await prisma.book.create({
    data: {
      ...parsedBook,
      status,
      type,
      publisher,
      userId: result.successData.user.id,
    },
  });
  return book;
});
