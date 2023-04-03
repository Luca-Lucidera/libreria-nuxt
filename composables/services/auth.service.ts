import ILogin from "~~/interface/auth/login";
import IRegister from "~~/interface/auth/register";

export const login = async (userLogin: ILogin) => {
  try {
    const user = await $fetch("/api/auth/login", {
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
    return await $fetch("/api/auth/session", {
      credentials: "include",
    });
  } catch (error) {
    return handleErrorApi(error);
  }
};

export const register = async (user: IRegister) => {
  try {
    return await $fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(user),
    });
  } catch (error) {
    return handleErrorApi(error);
  }
};

export const logout = async (user: any) => {
  try {
    return await $fetch("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify(user),
    });
  } catch (error) {
    return handleErrorApi(error);
  }
}