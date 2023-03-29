import ILogin from "~~/interface/auth/login";
import IRegister from "~~/interface/auth/register";
import IUser from "~~/interface/user";

export const login = async (userLogin: ILogin) => {
  try {
    console.log('SERVICE RAGGIUNTO')
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

export const register = async (user: IRegister) => {
  try {
    return await $fetch<IUser>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(user),
    });
  } catch (error) {
    return handleErrorApi(error);
  }
};
