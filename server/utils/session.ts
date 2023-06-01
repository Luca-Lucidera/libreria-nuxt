import { User } from "@prisma/client";
import { H3Event } from "h3";
import Result from "~~/interface/result";

type SuccessData = {
  isNewToken: boolean;
  jwt?: string;
  user?: User;
};

export async function handleSecurity(
  event: H3Event
): Promise<Result<SuccessData, string>> {
  //Prendo header autorizzazione
  const AuthHeader = getHeader(event, "Authorization");
  console.log("AuthHeader", AuthHeader);

  if (AuthHeader) {
    const token = AuthHeader.split("Bearer ")[1];
    if (token != "" || token != null || token != "null" || token != undefined) {
      const resultAccess = verifyJwtAndDecode(token);
      if (resultAccess.success) {
        const userId = resultAccess.successData;
        if (!userId) {
          return {
            success: false,
            errorData: "Token is invalid",
          };
        }
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        if (!user) {
          return {
            success: false,
            errorData: "User not found",
          };
        }
        return {
          success: true,
          successData: {
            isNewToken: false,
            user: user,
          },
        };
      }
      //il token non è valido, controllo se è un fatal error
      if (resultAccess.errorData?.name !== "ExpiredToken") {
        return {
          success: false,
          errorData: "Token is invalid",
        };
      }
    }
  }
  const refreshToken = getCookie(event, "refresh_token");
  if (!refreshToken) {
    return {
      success: false,
      errorData: "Missing refresh token",
    };
  }

  //valido il refresh token
  const resultRefresh = verifyJwtAndDecode(refreshToken);
  if (!resultRefresh.success) {
    return {
      success: false,
      errorData: "Refresh token is invalid",
    };
  }

  const userId = resultRefresh.successData;
  if (!userId) {
    return {
      success: false,
      errorData: "Refresh token is invalid",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return {
      success: false,
      errorData: "User not found",
    };
  }

  //genero un nuovo access token
  const newAccessToken = generateAccessToken(user);

  return {
    success: true,
    successData: {
      isNewToken: true,
      jwt: newAccessToken,
      user: user,
    },
  };
}

//il token ha una signature valida ma è scaduto, quindi controllo il refresh token
