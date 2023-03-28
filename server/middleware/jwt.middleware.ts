import IUser from '~/interface/user';
export default defineEventHandler(async (event) => {
  if (!event.node.req.url?.includes("auth")) {
    const sessionJwt = getSessionValue(event);
    const userId = verifyJwt(sessionJwt);
    const user = await prisma.users.findFirst({
      where: {
        id: userId,
        jwt: sessionJwt,
      },
    }) as IUser | null;
    if(!user) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }
    event.context.user = user;
  }
});
