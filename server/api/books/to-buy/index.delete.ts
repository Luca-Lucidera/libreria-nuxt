import type { BookToBuy } from "~/types/book/bookToBuy";

export default defineEventHandler(async (event): Promise<BookToBuy[]> => {
  const securityResult = await handleSecurity(event);
  if (!securityResult.success) {
    throw createError({
      statusCode: 401,
      statusMessage: securityResult.errorData,
    });
  }

  const userId = securityResult.successData?.user?.id;
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Token invalid" });
  }

  const { price, title, volume } = await readBody<BookToBuy>(event);

  const bookToBuy = await prisma.bookToBuy.findFirst({
    where: {
      title,
      volume,
      price,
      userId,
    },
  });

  if (!bookToBuy) {
    throw createError({
      statusCode: 404,
      statusMessage: "Book to buy not found",
    });
  }

  await prisma.bookToBuy.delete({
    where: {
      id: bookToBuy.id,
    },
  });

  const btb = await prisma.bookToBuy.findMany({
    where: {
      userId,
    },
  });

  return btb.map((bookToBuy) => ({
    title: bookToBuy.title,
    volume: bookToBuy.volume,
    price: bookToBuy.price,
  }));
});
