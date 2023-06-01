// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    shim: false,
  },
  imports: {
    dirs: ["composables/**"],
  },
  css: ["vuetify/lib/styles/main.sass"],
  build: {
    transpile: ["vuetify"],
  },
  modules: ["@pinia/nuxt", "@nuxt/devtools"],
  runtimeConfig: {
    jwtSecret: "",
    jwtAud: "",
    jwtIss: "",
    public: {
      api: "/api",
      env: "development",
    },
  },
});
