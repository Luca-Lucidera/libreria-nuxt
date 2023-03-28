export default defineEventHandler(async (event) => {
  const sessionJwt = getSessionValue(event);
  const userId = verifyJwt(sessionJwt);
  const user = await prisma.users.findUnique({
    where: {
      id: userId
    }
  })
  if(!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  return user;
});