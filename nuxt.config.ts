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
  modules: ["@pinia/nuxt"],
  runtimeConfig: {
    jwt: {
      secret: "9575a2c6-7951-4085-9658-a7f6f1eb2e0c",
      iss: "la-tua-libreria-api",
      aud: "la-tua-libreria",
    },
    public: {
      api: "/api",
      env: "development",
    },
  },
});
