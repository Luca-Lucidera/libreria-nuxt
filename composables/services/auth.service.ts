import ILogin from "@/interface/login";
import User from "~~/interface/user";
import { useUserStore } from "~~/store/user.store";

export const login = async (userLogin: ILogin) => {
  try {
    const user = await $fetch<User>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(userLogin),
    });
    const userStore = useUserStore();
    userStore.setUser(user);
    return user;
  } catch (error: any) {
    if(error.status !== 500){
      throw new Error(error.statusMessage);
    }
    throw new Error("Something went wrong");
  }
};
