import ILogin from "@/interface/login";
import User from "~~/interface/user";
export const login = async (userLogin: ILogin) => {
  try {
    const user = await $fetch<User>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(userLogin),
    });
    return user;
  } catch (error: any) {
    console.log(error instanceof Error);
    if(error instanceof Error) {
      console.log(error.message);
    }
  }
};
