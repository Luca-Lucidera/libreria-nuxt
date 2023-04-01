import { NuxtError } from "#app";
import { Users } from "@prisma/client";
import { defineStore } from "pinia";
import ILogin from "~~/interface/auth/login";
import IRegister from "~~/interface/auth/register";

export const useUserStore = defineStore("user", () => {
  const user = ref<Users | null>(null);
  const computedUser = computed(() => user.value);
  const reset = () => {
    user.value = null;
  };

  
  const authenticate = async (loginCredential: ILogin) => {
    const { data: userFetched, error } = await useLazyAsyncData<
      Users,
      NuxtError
    >("authenticate", () =>
      $fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(loginCredential),
      })
    );
    if (error.value) {
      return error.value.statusMessage;
    }
    if (userFetched.value!) {
      user.value = userFetched.value!;
    }
  };

  const authenticateViaSession = async () => {
    const { data: userFetched, error } = await useLazyAsyncData<
      Users,
      NuxtError
    >("authenticateViaSession", () =>
      $fetch("/api/auth/session", { credentials: "include" })
    );
    if (error.value) {
      return error.value.statusMessage;
    }
    if (userFetched.value!) {
      user.value = userFetched.value!;
    }
  };
  const createUser = async (registerCredential: IRegister) => {
    const { data: userFetched, error } = await useLazyAsyncData<
      Users,
      NuxtError
    >("createUser", () =>
      $fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(registerCredential),
      })
    );
    if (error.value) {
      return error.value.statusMessage;
    }
    if (userFetched.value!) {
      user.value = userFetched.value!;
    }
  };
  const endSession = async () => {
    if (!computedUser.value) return;
    const { error } = await useLazyAsyncData("endSession", () =>
      $fetch("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({id: computedUser.value?.id}),
      })
    );
    if (error.value) {
      console.log(error.value);
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
