import { User } from "@prisma/client";
import { defineStore } from "pinia";
import ILogin from "~~/interface/auth/login";
import IRegister from "~~/interface/auth/register";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const computedUser = computed(() => user.value);
  const reset = () => {
    user.value = null;
  };

  const authenticate = async (loginCredential: ILogin) => {
    // try {
    //   user.value = await login(loginCredential);

    // } catch (error) {}
    const { data, error } = await useLazyFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(loginCredential),
    });
    if (error.value) {
      return error.value?.statusMessage;
    }
    if (data.value) {
      user.value = data.value;
    }
  };

  const authenticateViaSession = async () => {
    // try {
    //   user.value = await retriveUserViaSession();
    // } catch (error) {
    //   console.log(error);
    // }
    const { data, error } = await useLazyFetch("/api/auth/session", {
      credentials: "include",
    });
  };
  const createUser = async (registerCredential: IRegister) => {
    try {
      user.value = await register(registerCredential);
    } catch (error) {
      console.error(error);
    }
  };
  const endSession = async () => {
    try {
      await logout(computedUser.value);
      reset();
    } catch (error) {
      console.error(error);
    }
    reset();
  };
  const isLogged = computed(
    () => user.value !== null && user.value !== undefined
  );

  return {
    computedUser,
    authenticate,
    authenticateViaSession,
    reset,
    isLogged,
    createUser,
    endSession,
  };
});
