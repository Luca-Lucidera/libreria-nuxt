import IUser from "~~/interface/user";

export default defineEventHandler(async (event) => {
  const user = await readBody(event) as IUser;
  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: "User is required",
    });
  }
  await prisma.users.update({
    where: {
      id: user.id,
    },
    data: {
      jwt: "",
    },
  });
  setCookie(event, "session", "", {
    expires: new Date(0),
  });
  return "logged out";
})