import { User } from "@prisma/client";
import { defineStore } from "pinia";
import ILogin from "~~/interface/auth/login";
import IRegister from "~~/interface/auth/register";

export const useUserStore = defineStore("user", () => {
  const globalStore = useGlobalStore();

  const user = ref<User | null>(null);
  const computedUser = computed(() => user.value);
  const reset = () => {
    user.value = null;
  };

  const authenticate = async (loginCredential: ILogin) => {
    try {
      const data = await $fetch<{ user: User; accessToken: string }>(
        "/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify(loginCredential),
        }
      );

      if (data.accessToken && data.user) {
        const { user: utente, accessToken } = data;
        user.value = utente;
        if (accessToken) {
          globalStore.setJwt(accessToken);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const authenticateViaSession = async () => {
    try {
      const data = await $fetch<{ user: User; accessToken: string }>(
        "/api/auth/session",
        {
          credentials: "include",
          headers: {
            Authorization: globalStore.computedJwt
              ? `Bearer ${globalStore.computedJwt}`
              : "",
          },
        }
      );
      if ((data.user, data.accessToken)) {
        const { user: utente, accessToken } = data;
        user.value = utente;
        if (accessToken) {
          globalStore.setJwt(accessToken);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const createUser = async (registerCredential: IRegister) => {
    const data = await $fetch<{ user: User; accessToken: string }>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify(registerCredential),
      }
    );
    if (data.accessToken && data.user) {
      const { user: utente, accessToken } = data;
      user.value = utente;
      if (accessToken) {
        globalStore.setJwt(accessToken);
      }
    }
  };

  const endSession = async () => {
    try {
      await $fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      reset();
    } catch (error) {
      throw error;
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
    createUser,
    endSession,
  };
});
