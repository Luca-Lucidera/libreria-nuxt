export default defineEventHandler(async (event) => {
  if (
    event.node.req.url?.startsWith("/api/books") ||
    event.node.req.url?.startsWith("/api/auth/session") ||
    event.node.req.url?.startsWith("/api/auth/logout")
  ) {
    const sessionJwt = getSessionJwtFromCookie(event);
    const userId = verifyJwt(sessionJwt);
    const user = await prisma.user.findFirst({
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
