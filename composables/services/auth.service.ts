import ILogin from "@/interface/login";
import IUser from "~~/interface/user";

export const login = async (userLogin: ILogin) => {
  try {
    const user = await $fetch<IUser>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(userLogin),
    });
    return user;
  } catch (error: any) {
    return handleErrorApi(error);
  }
};

export const retriveUserViaSession = async () => {
  try {
    return await $fetch<IUser>("/api/auth/session", {
      credentials: "include",
    });
  } catch (error) {
    return handleErrorApi(error);
  }
};
