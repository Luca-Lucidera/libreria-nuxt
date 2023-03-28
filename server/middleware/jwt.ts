import IUser from "~/interface/user";
export default defineEventHandler(async (event) => {
  if (
    event.node.req.url?.startsWith("/api") &&
    !event.node.req.url?.startsWith("/api/auth") &&
    !event.node.req.url?.startsWith("/api/table") &&
    !event.node.req.url?.startsWith("/api/filter")
  ) {
    console.log("event.node.req.url", event.node.req.url);
    const sessionJwt = getSessionValue(event);
    const userId = verifyJwt(sessionJwt);
    const user = (await prisma.users.findFirst({
      where: {
        id: userId,
        jwt: sessionJwt,
      },
    })) as IUser | null;
    if (!user) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }
    event.context.user = user;
  }
});
