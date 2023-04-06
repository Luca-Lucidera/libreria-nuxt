export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();
  if (!userStore.isLogged) {
    try {
      await userStore.authenticateViaSession();
      return;
    } catch {
      if (to.path != "/login" && to.path != "/register") {
        return navigateTo("/login");
      } else {
        return;
      }
    }
  } else {
    return;
  }
});
