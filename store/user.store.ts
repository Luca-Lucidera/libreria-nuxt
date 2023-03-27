import { defineStore } from "pinia";
import User from "~~/interface/user";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);

  const computedUser = computed(() => user.value);

  const setUser = (newUser: User) => {
    user.value = newUser;
  };
  const reset = () => {
    user.value = null;
  };

  return {
    computedUser,
    setUser,
    reset,
  };
});
