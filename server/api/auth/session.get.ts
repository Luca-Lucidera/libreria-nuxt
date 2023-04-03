export default defineEventHandler(async (event) => {
<<<<<<< HEAD
  const sessionJwt = getSessionJwtFromCookie(event);

  const userId = verifyJwt(sessionJwt);
  
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      jwt: sessionJwt,
    }
  })
  
  if(!user) {
=======
  const sessionJwt = getSessionValue(event);
  const userId = verifyJwt(sessionJwt);
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
      jwt: sessionJwt,
    },
  });
  if (!user) {
>>>>>>> master
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  
  return user;
});
