import { defineStore } from "pinia";
import type { Snackbar } from "~/types/snackbar";

export const useGlobalStore = defineStore("global", () => {
  
  // STATE
  const isLoading = ref(false);
  const theme = ref("dark");
  const jwt = ref<string | null>(null);
  const snackbar = ref<Snackbar>({
    show: false,
    message: "",
    color: "",
    timeout: 3000,
  });

  const $reset = () => {
    isLoading.value = false;
    theme.value = "dark";
    jwt.value = null;
    snackbar.value = {
      show: false,
      message: "",
      color: "",
      timeout: 3000,
    }
  }

  //JWT
  const setJwt = (token: string) => {
    jwt.value = token;
  };
  const clearJwt = () => {
    jwt.value = null;
  };

  // LOADING
  const startLoading = () => {
    isLoading.value = true;
  };
  const stopLoading = () => {
    isLoading.value = false;
  };

  // THEME
  const changeTheme = () => {
    if (theme.value === "dark") {
      theme.value = "light";
    } else {
      theme.value = "dark";
    }
  };

  // SNACKBAR
  const showSnackbar = (message = "", color = "secondary") => {
    snackbar.value.show = true;
    snackbar.value.message = message;
    snackbar.value.color = color;
    /**
     * Reminder per il futuro, se è presente un timeout la prop show verrà messa automaticamente a false dopo il periodo di tempo indicato
     */
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
    changeTheme,
    jwt,
    clearJwt,
    setJwt,
    snackbar,
    showSnackbar,
    $reset
  };
});
