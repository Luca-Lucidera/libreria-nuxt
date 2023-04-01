export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: "user not found",
    });
  }
  await prisma.users.update({
    where: {
      id: body.id,
    },
    data: {
      jwt: "",
    },
  });
  setCookie(event, "session", "", {
    expires: new Date(0),
  });
  return true;
});
