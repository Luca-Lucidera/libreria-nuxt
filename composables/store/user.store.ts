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
    const { data, error } = await useLazyFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(loginCredential),
    });
    if (error.value) {
      throw error.value;
    }
    if (data.value) {
      user.value = data.value;
    }
  };

  const authenticateViaSession = async () => {
    const { data, error } = await useLazyFetch("/api/auth/session", {
      credentials: "include",
    });

    if (error.value) {
      throw error.value;
    }

    if (data.value) {
      user.value = data.value;
    }
  };

  const createUser = async (registerCredential: IRegister) => {
    const { data, error } = await useLazyFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(registerCredential),
    });

    if (error.value) {
      throw error.value;
    }

    if (data.value) {
      user.value = data.value;
    }
  };

  const endSession = async () => {
    const { error } = await useLazyFetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    if (error.value) {
      throw error.value;
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
