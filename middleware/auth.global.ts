import { useUserStore } from "~~/store/user.store";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const userStore = useUserStore();
    if (!userStore.isLogged) {
      try {
        await userStore.authenticateViaSession();
        return navigateTo("/");
      } catch (error) {
        if (to.path != "/login" && to.path != "/register") {
          return navigateTo("/login");
        } else {
          return;
        }
      }
    } else {
      return;
    }
  }
});
