type Body = {
  numeroCopertina: number;
  mangaTitle: string;
};
export default defineEventHandler(async (event) => {
  const { mangaTitle, numeroCopertina } = await readBody<Body>(event, {
    strict: true,
  });

  const book = await prisma.book.findFirst({ where: { title: mangaTitle } });
  if (!book) {
    throw createError({ statusCode: 404, statusMessage: "Book not found" });
  }

  const { id } = book;

  await prisma.book.update({
    where: {
      id,
    },
    data: {
      cover: `${numeroCopertina}.jpg`,
    },
  });

  return;
});
