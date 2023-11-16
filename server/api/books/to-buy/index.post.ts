import type { BookToBuy } from "~/types/book/bookToBuy";

export default defineEventHandler(async (event) => {
  const result = await handleSecurity(event);
  if (!result.success) {
    throw createError({ statusCode: 401, statusMessage: result.errorData });
  }
  if (!result.successData?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: "Token invalid" });
  }

  const userId = result.successData?.user?.id;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Token invalid" });
  }

  const books = await readBody<BookToBuy[]>(event);

  if (!books) {
    throw createError({ statusCode: 400, statusMessage: "Books not valid" });
  }

  const booksToBuy = await prisma.bookToBuy.findMany({
    where: {
      userId: userId,
    },
  });

  const notDuplicate = books.filter(
    (book) =>
      !booksToBuy.find(
        (btb) =>
          book.title === btb.title &&
          book.price === btb.price &&
          book.volume === btb.volume
      )
  );

  let duplicate = notDuplicate.length !== books.length;

  await prisma.bookToBuy.createMany({
    data: notDuplicate.map((book) => ({
      ...book,
      userId: userId,
    })),
  });
  return { success: true, duplicate };
});
