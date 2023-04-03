export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    return createError({ statusCode: 400, statusMessage: "the id of the book is required" });
  }
  await prisma.book.delete({
    where: {
      id,
    },
  });
  return "OK";
});
