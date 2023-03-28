import { defineStore } from "pinia";
import ILogin from "~~/interface/login";
import IUser from "~~/interface/user";

export const useUserStore = defineStore("user", () => {
  const user = ref<IUser | null>(null);
  const computedUser = computed(() => user.value);
  const reset = () => {
    user.value = null;
  };

  const authenticate = async (loginCredential: ILogin) => {
    try {
      user.value = await login(loginCredential);
    } catch (err) {
      throw err;
    }
  };
  const authenticateViaSession = async () => {
    try {
      user.value = await retriveUserViaSession();
    } catch (err) {
      handleErrorApi(err);
    }
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
  };
});
