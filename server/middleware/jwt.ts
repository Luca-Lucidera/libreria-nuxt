export default defineEventHandler(async (event) => {
  const url = event.node.req.url;
  if (
    url?.startsWith("/api") &&
    !url?.startsWith("/api/auth") &&
    !url?.startsWith("/api/table") &&
    !url?.startsWith("/api/filter")
  ) {
    const sessionJwt = getSessionJwtFromCookie(event);
    const userId = verifyJwt(sessionJwt);
    const user = await prisma.users.findFirst({
      where: {
        id: userId,
        jwt: sessionJwt,
      },
    });
    if (!user) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }
    event.context.user = user;
  }
});
