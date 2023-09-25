import { BookToBuy } from "types/book/bookToBuy";

export default defineEventHandler(async (event): Promise<BookToBuy[]> => {
  const {
    success: ss,
    errorData: eds,
    successData: sds,
  } = await handleSecurity(event);
  if (!ss) {
    throw createError({ statusCode: 401, statusMessage: eds });
  }

  const userId = sds?.user?.id;
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

  const btb =  await prisma.bookToBuy.findMany({
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
