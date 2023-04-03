export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const userStore = useUserStore();
    if (!userStore.isLogged) {
      try {
        await userStore.authenticateViaSession();
        return;
      } catch (error) {
        if (error) {
          if (to.path != "/login" && to.path != "/register") {
            return navigateTo("/login");
          } else {
            return;
          }
        }
        return navigateTo("/");
      }
    } else {
      return;
    }
  }
});
