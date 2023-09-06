import { BookToBuy } from "~/types/book/bookToBuy";
export default defineEventHandler(async (event) => {
  const result = await handleSecurity(event);
  if (!result.success) {
    throw createError({ statusCode: 401, statusMessage: result.errorData });
  }
  if (!result.successData?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: "Token invalid" });
  }

  const userId = result.successData.user.id;

  const books = await readBody<BookToBuy[]>(event);
  if (!books) {
    throw createError({ statusCode: 400, statusMessage: "Books not valid" });
  }

  await prisma.bookToBuy.createMany({
    data: books.map((book) => ({
      ...book,
      userId: userId,
    })),
  });
  
  return;
});
