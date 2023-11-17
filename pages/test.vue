<script setup lang="ts">
import { useDisplay } from "vuetify";
const globalStore = useGlobalStore();
const simulateFetch = async () => {
  try {
    globalStore.startLoading();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    globalStore.showSnackbar("This is a snackbar message", "success");
  } finally {
    globalStore.stopLoading();
  }
};

const display = useDisplay();

const env = process.env.NODE_ENV;
definePageMeta({
  middleware: [
    () => {
      if (process.env.NODE_ENV === "production") {
        return "/";
      }
    },
  ],
});
</script>

<template>
  <VBtn @click="simulateFetch">Test snackbar</VBtn>
  <p>Env '{{ env }}'</p>
  <p>{{ globalStore.snackbar }}</p>

  
  <p>smAndDown {{ display.smAndDown }}</p>
  <p>smAndUp {{ display.smAndUp }}</p>
  <p>sm {{ display.sm }}</p>
  <hr>
  <p>md {{ display.md }}</p>
  <p>mdAndDown {{ display.mdAndDown }}</p>
  <p>mdAndUp {{ display.mdAndUp }}</p>
  <hr>
  <p>lg {{ display.lg }}</p>
  <p>lgAndDown {{ display.lgAndDown }}</p>
  <p>lgAndUp {{ display.lgAndUp }}</p>
  <hr>
  <p>xl {{ display.xl }}</p>
  <p>xlAndDown {{ display.xlAndDown }}</p>
  <p>xlAndUp {{ display.xlAndUp }}</p>
  <hr>
  <p>width * height {{ display.width }}x{{ display.height }} </p>
</template>
