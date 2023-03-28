import '@mdi/font/css/materialdesignicons.css'; // Ensure you are using css-loader
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    icons: {
      defaultSet: "mdi",
      sets: {
        mdi,
      },
      aliases,
    },
    theme: {
      defaultTheme: "dark",
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
