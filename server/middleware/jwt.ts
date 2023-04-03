export default defineEventHandler(async (event) => {
  if (
    event.node.req.url?.startsWith("/api") &&
    !event.node.req.url?.startsWith("/api/auth") &&
    !event.node.req.url?.startsWith("/api/table") &&
    !event.node.req.url?.startsWith("/api/filter")
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
