import { H3Event } from "h3";
import Result from "~~/interface/result";
export default defineEventHandler(async (event) => {
  const result = await handleSecurity(event);
  return result;
});

type SuccessData = {
  isNewToken: boolean;
  jwt?: string;
};

async function handleSecurity(
  event: H3Event
): Promise<Result<SuccessData, string>> {
  //Prendo header autorizzazione
  const AuthHeader = getHeader(event, "Authorization");
  if (!AuthHeader) {
    return {
      success: false,
      errorData: "Missing Authorization header",
    }
  }
  
  //Tolgo la parte di Bearer
  const token = AuthHeader.split("Bearer ")[1];
  if (!token) {
    return {
      success: false,
      errorData: "Missing token",
    }
  }

  //valido il token
  const resultAccess = verifyJwtAndDecode(token);
  if(resultAccess.success) {
    const userId = resultAccess.successData;
    if(!userId) {
      return {
        success: false,
        errorData: "Token is invalid",
      }
    }
    return {
      success: true,
      successData: {
        isNewToken: false,
      }
    }
  }

  //il token non è valido, controllo se è un fatal error
  if(resultAccess.errorData?.name !== "ExpiredToken") {
    return {
      success: false,
      errorData: "Token is invalid",
    }
  }

  //il token ha una signature valida ma è scaduto, quindi controllo il refresh token
  const refreshToken = getCookie(event, "refresh_token");
  if(!refreshToken) {
    return {
      success: false,
      errorData: "Missing refresh token",
    }
  }

  //valido il refresh token
  const resultRefresh = verifyJwtAndDecode(refreshToken);
  if(!resultRefresh.success) {
    return {
      success: false,
      errorData: "Refresh token is invalid",
    }
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
    },
  };
}
