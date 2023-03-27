<script setup lang="ts">
import { useUserStore } from "~~/store/user.store";

const userStore = useUserStore();
const { setUser, reset } = userStore;
</script>

<template>
  <div>
  </div>
</template>
