<script setup lang="ts">
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

addRouteMiddleware(() => {
  if (process.env.NODE_ENV === "production") {
    return "/";
  }
});
const env = process.env.NODE_ENV;
</script>

<template>
  <VBtn @click="simulateFetch">Test snackbar</VBtn>
  <p>Env '{{ env }}'</p>
  <p>{{ globalStore.snackbar }}</p>
</template>