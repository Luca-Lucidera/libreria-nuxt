import {navigateTo} from "#imports";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const userStore = useUserStore();
    if (!userStore.isLogged) {
      const result = await userStore.authenticateViaSession();
      if (result.success) {
        if (to.path === "/login" || to.path === "/register") {
          return navigateTo("/");
        } else return;
      } else {
        if (to.path != "/login" && to.path != "/register") {
          return navigateTo("/login");
        } else {
          return;
        }
      }
    } else return;
  }
});
