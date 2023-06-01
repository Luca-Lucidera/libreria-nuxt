export default defineEventHandler(async (event) => {
  const result = await handleSecurity(event);
  if (!result.success) {
    throw createError({ statusCode: 401, statusMessage: result.errorData });
  }
  if (!result.successData?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: "Token invalid" });
  }
  const id = event.context.params?.id;
  if (!id) {
    return createError({
      statusCode: 400,
      statusMessage: "the id of the book is required",
    });
  }
  await prisma.book.delete({
    where: {
      id,
    },
  });
  return "OK";
});
