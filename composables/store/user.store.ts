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
      const { data, error } = await useFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(loginCredential),
      });

      if (error.value) throw error.value;

      if (data.value?.accessToken && data.value?.user) {
        const { user: utente, accessToken } = data.value;
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
    const { data, error } = await useFetch("/api/auth/session", {
      credentials: "include",
      headers: {
        Authorization: globalStore.computedJwt
          ? `Bearer ${globalStore.computedJwt}`
          : "",
      },
    });

    if (error.value) throw error.value;

    if (data.value) {
      const { user: utente, accessToken } = data.value;
      user.value = utente;
      if (accessToken) {
        globalStore.setJwt(accessToken);
      }
    }
  };

  const createUser = async (registerCredential: IRegister) => {
    const { data, error } = await useFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(registerCredential),
    });

    if (error.value) throw error.value;

    if (data.value?.accessToken && data.value?.user) {
      const { user: utente, accessToken } = data.value;
      user.value = utente;
      if (accessToken) {
        globalStore.setJwt(accessToken);
      }
    }
  };

  const endSession = async () => {
    const { error } = await useFetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    
    reset();
   
    if (error.value) throw error.value;
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
