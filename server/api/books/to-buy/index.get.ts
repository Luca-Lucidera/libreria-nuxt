import type { BookToBuy } from "~/types/book/bookToBuy";

export default defineEventHandler(async (event): Promise<BookToBuy[]> => {
  const result = await handleSecurity(event);
  if (!result.success) {
    throw createError({ statusCode: 401, statusMessage: result.errorData });
  }

  if (!result.successData?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: "Token invalid" });
  }

  const userBooksToBuy = await prisma.bookToBuy.findMany({
    where: {
      userId: result.successData.user.id,
    },
  });

  return userBooksToBuy.map((bookToBuy) => ({
    title: bookToBuy.title,
    volume: bookToBuy.volume,
    price: bookToBuy.price,
  }));
});
