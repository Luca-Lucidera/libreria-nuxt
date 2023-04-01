export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const userStore = useUserStore();
    if (to.path === "/test") return;
    if (!userStore.isLogged) {
      const error = await userStore.authenticateViaSession();
      if (error) {
        if (to.path != "/login" && to.path != "/register") {
          return navigateTo("/login");
        } else {
          return;
        }
      }
      return navigateTo("/");
    } else {
      return;
    }
  }
});
