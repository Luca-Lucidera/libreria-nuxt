import bcrypt from "bcrypt";
import { UserLoginDTO } from "~/types/user/userLoginDTO";

export default defineEventHandler(async (event) => {
  const body = await readBody<UserLoginDTO>(event, { strict: true});
  if (!body || !body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid credentials",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "Invalid credentials",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
  if (!isPasswordCorrect) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid credentials",
    });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  setCookie(event, "refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });
  return { user: user, accessToken: accessToken }
});
