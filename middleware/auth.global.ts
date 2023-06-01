export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();
  if (!userStore.isLogged) {
    try {
      await userStore.authenticateViaSession();
      if(to.path == "/login" || to.path == "/register") {
        return await navigateTo("/");
      } else {
        return;
      }
    } catch {
      if (to.path != "/login" && to.path != "/register") {
        return await navigateTo("/login");
      } else {
        return;
      }
    }
  } else {
    return;
  }
});
