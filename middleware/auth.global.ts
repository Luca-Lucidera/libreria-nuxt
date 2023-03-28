import { useUserStore } from "~~/store/user.store";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    console.log(to.path);
    const userStore = useUserStore();
    if (!userStore.isLogged) {
      try {
        console.log("try to authenticate via session")
        await userStore.authenticateViaSession();
        return navigateTo("/");
      } catch (error) {
        console.log('Sessione non trovata', 'to.path', to.path)
        if (to.path !== "/login") {
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
