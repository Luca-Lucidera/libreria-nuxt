import { User } from "@prisma/client";
import { H3Event } from "h3";
import {Result} from "~/types/result";

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

  //controllo che nella richiesta sia presente
  if (AuthHeader) {
    const token = AuthHeader.split("Bearer ")[1];

    //controllo che il token sia presente
    if (token != "" || token != null || token != "null" || token != undefined) {

      //controllo la validità del token e lo decodifica se valido
      const resultAccess = verifyJwtAndDecode(token);

      //controllo che sia un token valido
      if (resultAccess.success) {

        //il token è valido e prende l'id dell'utente
        const userId = resultAccess.successData;

        //controllo che non ci siano stati errori nel prendere l'id
        if (!userId) {
          return {
            success: false,
            errorData: "Token is invalid",
          };
        }

        //prendo le altre infomazioni dell'utente
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        //caso di errore ma poco probabile
        if (!user) {
          return {
            success: false,
            errorData: "User not found",
          };
        }

        //tutto a posto
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

    /**
      se il token non è presente procede con l'esecuzione sottostante
      esempio: utente appena apre il sito non ha l'access token, ma ha il refresh token
      bypassa l'if di prima e fa direttamente i passaggi dopo
    */
  }

  //prendo il jwt di refresh
  const refreshToken = getCookie(event, "refresh_token");

  //se non è presente vuol dire che la sessione è scaduta o non è loggato
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
