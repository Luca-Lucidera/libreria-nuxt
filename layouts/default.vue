<template>
  <VLayout>
    <VContainer class="h-screen">
      <VAppBar>
        <VAppBarTitle class="text-center"
          >Your library
          {{
            userStore.computedUser ? userStore.computedUser.name : null
          }}</VAppBarTitle
        >
        <VBtn icon="mdi-account-circle" />
      </VAppBar>
      <VMain class="h-100">
        <slot />
        <VDialog
          v-model="globalStore.getIsLoading"
          persistent
          class="bg-transparent"
        >
          <VContainer class="h-screen d-flex justify-center align-center">
            <VCard class="w-25">
              <VCardTitle class="text-center">Loading...</VCardTitle>
              <VProgressLinear indeterminate color="primary" />
            </VCard>
          </VContainer>
        </VDialog>
      </VMain>
    </VContainer>
  </VLayout>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const globalStore = useGlobalStore();
</script>
