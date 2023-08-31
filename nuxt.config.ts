// @ts-ignore
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    typescript: {
        strict: true
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
    $development: {
        sourcemap: {
            client: true,
            server: true,
        },
    },
    ssr: false,
});
