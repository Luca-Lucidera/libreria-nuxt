import { defineStore } from "pinia";

export const useGlobalStore = defineStore('global', () => {
  const isLoading = ref(false);
  const theme = ref('dark');
  
  const jwt = ref<string | null>(null);
  const computedJwt = computed(() => jwt.value);
  const setJwt = (token: string) => {
    jwt.value = token;
  };
  const clearJwt = () => {
    jwt.value = null;
  };

  const getIsLoading = computed(() => isLoading.value);
  const getTheme = computed(() => theme.value);

  const startLoading = () => {
    isLoading.value = true;
  };
  const stopLoading = () => {
    isLoading.value = false;
  };
  const changeTheme = () => {
    if(theme.value === 'dark') {
      theme.value = 'light';
    } else {
      theme.value = 'dark';
    }
  };

  return {
    getIsLoading,
    getTheme,
    startLoading,
    stopLoading,
    changeTheme,
    computedJwt,
    clearJwt,
    setJwt
  };
});
