export default defineEventHandler(async (event) => {
  const sessionJwt = getSessionJwtFromCookie(event);

  const userId = verifyJwt(sessionJwt);
  
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      jwt: sessionJwt,
    }
  })
  
  if(!user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  
  return user;
});