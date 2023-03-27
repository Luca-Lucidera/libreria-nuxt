import User from "~~/interface/user";
import { useUserStore } from "~~/store/user.store";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const userStore = useUserStore();
    if (!userStore.isLogged) {
      try {
        try {
          console.log("fetching user");
          const user = await $fetch<User>("/api/auth/session", {
            credentials: "include",
          });
          userStore.setUser(user);
          return;
        } catch (error) {
          console.log("errore middleware", error);
          return navigateTo("/login");
        }
      } catch (error) {
        console.log("errore middleware", error);
        return navigateTo("/login");
      }
    } else if (to.path === "/login") {
      return navigateTo("/");
    }
  }
});
