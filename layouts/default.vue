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
        <VMenu location="bottom" v-if="userStore.computedUser">
          <template v-slot:activator="{ props }">
            <VBtn color="primary" v-bind="props" icon="mdi-account-circle" />
          </template>
          <VCard>
            <VList>
              <VListItem>
                <VBtn prepend-icon="mdi-account-cog">Settings</VBtn>
                <VBtn prepend-icon="mdi-logout" @click="handleLogout"
                  >Logout</VBtn
                >
              </VListItem>
            </VList>
          </VCard>
        </VMenu>
      </VAppBar>
      <VMain class="h-100">
        <slot />
        <VDialog v-model="globalStore.getIsLoading" persistent>
          <VContainer class="h-screen d-flex justify-center align-center">
            <VCard class="w-25">
              <VCardTitle class="text-center">Loading...</VCardTitle>
              <VProgressLinear indeterminate color="primary" />
            </VCard>
          </VContainer>
        </VDialog>
      </VMain>
      <VSnackbar v-model="showSnackbar" color="info" elevation="24">
        <p>
          If the layout of the page look weird, please press CTRL + F5 or CTRL +
          SHIFT + R
        </p>
        <template v-slot:actions>
          <VBtn color="white" @click="showSnackbar = false" variant="elevated"
            >I understand</VBtn
          >
        </template>
      </VSnackbar>
    </VContainer>
  </VLayout>
</template>

<script setup lang="ts">
import { FetchError } from "ofetch";

const userStore = useUserStore();
const globalStore = useGlobalStore();

const showSnackbar = useState(() => true);

const handleLogout = async () => {
  try {
    globalStore.startLoading();
    await userStore.endSession();
  } catch (err: any) {
    const error: FetchError = err;
    if (error.statusCode !== 500) {
      if (!error.statusMessage) {
        console.log("something went wrong");
      } else {
        console.log(error.statusMessage);
      }
    } else {
      console.log("something went wrong");
    }
  } finally {
    await useRouter().push("/login");
    globalStore.stopLoading();
  }
};
</script>
