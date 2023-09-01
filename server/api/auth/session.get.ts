export default defineEventHandler(async (event) => {
  const result = await handleSecurity(event);
  let renewJwt = null;
  if (!result.success) {
    throw createError({ statusCode: 401, statusMessage: result.errorData });
  }

  const user = await prisma.user.findFirst({
    where: {
      id: result.successData?.user?.id,
    },
  });

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  if (result.successData?.isNewToken) {
    renewJwt = result.successData?.jwt;
  }
  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken: renewJwt };
});
