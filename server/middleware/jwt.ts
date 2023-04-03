import IUser from "~/interface/user";
export default defineEventHandler(async (event) => {
  if (
    event.node.req.url?.startsWith("/api") &&
    !event.node.req.url?.startsWith("/api/auth") &&
    !event.node.req.url?.startsWith("/api/table") &&
    !event.node.req.url?.startsWith("/api/filter")
  ) {
    const sessionJwt = getSessionValue(event);
    const userId = verifyJwt(sessionJwt);
<<<<<<< HEAD
    const user = await prisma.user.findFirst({
=======
    const user = (await prisma.users.findFirst({
>>>>>>> master
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
