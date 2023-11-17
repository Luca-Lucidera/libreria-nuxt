<script lang="ts" setup>
import { useDisplay } from "vuetify";
const display = useDisplay();
onMounted(() => {
  if (process.env.NODE_ENV === "development") {
    console.table([
      { size: "sm", value: display.sm.value },
      { size: "smAndDown", value: display.smAndDown.value },
      { size: "smAndUp", value: display.smAndUp.value },
      { size: "md", value: display.md.value },
      { size: "mdAndDown", value: display.mdAndDown.value },
      { size: "mdAndUp", value: display.mdAndUp.value },
      { size: "lg", value: display.lg.value },
      { size: "lgAndDown", value: display.lgAndDown.value },
      { size: "lgAndUp", value: display.lgAndUp.value },
      { size: "xl", value: display.xl.value },
      { size: "xlAndDown", value: display.xlAndDown.value },
      { size: "xlAndUp", value: display.xlAndUp.value },
      { size: "xxl", value: display.xxl.value },
      {
        size: "width * height",
        value: `${display.width.value} x ${display.height.value}`,
      },
    ]);
  }
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html {
  overflow-y: hidden;
  overflow-x: hidden;
}
</style>
