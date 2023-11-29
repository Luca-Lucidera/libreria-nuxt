// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    strict: true,
  },
  css: ["vuetify/lib/styles/main.sass"],
  build: {
    transpile: ["vuetify"],
  },
  modules: ["@pinia/nuxt", "@vite-pwa/nuxt"],
  runtimeConfig: {
    jwtSecret: "",
    jwtAud: "",
    jwtIss: "",
    public: {
      api: "/api",
      env: "development",
      supabaseUrl: "",
      supabaseKey: "",
    },
  },
  $development: {
    sourcemap: true,
  },
  ssr: false,
  routeRules: {
    "/api/proxy/manga": {
      proxy: "https://api.mangadex.org/manga",
    },
    "/api/proxy/cover": {
      proxy: "https://api.mangadex.org/cover",
    },
    "/api/proxy/linkimage": {
      proxy: "https://uploads.mangadex.org/covers",
    },
  },
});
