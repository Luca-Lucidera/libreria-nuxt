<template>
  <VContainer class="h-100 d-flex justify-center align-center">
    <VCard class="w-50 rounded-xl">
      <VCardTitle class="text-center my-4 text-primary">LOGIN</VCardTitle>
      <VForm @submit.prevent="handleSubmit" ref="form">
        <VCardItem>
          <VTextField
            prependIcon="mdi-email"
            type="email"
            label="Email"
            variant="underlined"
            color="primary"
            v-model="loginForm.email"
            :rules="rules.auth.email"
          />
        </VCardItem>
        <VCardItem>
          <VTextField
            label="Password"
            variant="underlined"
            prependIcon="mdi-lock"
            color="primary"
            v-model="loginForm.password"
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="rules.auth.password"
            @click:append-inner="showPassword = !showPassword"
          />
        </VCardItem>
        <VCardText class="text-center text-error text-body-1">
          <span>{{ error }}</span>
        </VCardText>
        <VCardActions class="justify-center my-4">
          <VBtn
            type="submit"
            color="primary"
            variant="text"
            size="large"
            rounded="lg"
            elevation="18"
            width="auto"
          >
            Login
          </VBtn>
          <VBtn
            color="secondary"
            variant="text"
            size="large"
            rounded="lg"
            elevation="18"
            to="/register"
            width="auto"
            >REGISTER</VBtn
          >
        </VCardActions>
      </VForm>
    </VCard>
  </VContainer>
</template>

<script setup lang="ts">
import { FetchError } from "ofetch";
import { VForm } from "vuetify/components/VForm";
import ILogin from "~~/interface/auth/login";

//page state
const loginForm = useState<ILogin>("userLogin", () => {
  return {
    email: "",
    password: "",
  };
});
const form = ref<InstanceType<typeof VForm> | null>(null as any);
const showPassword = useState("showPassword", () => false);
const error = useState("error", () => "");

//store
const globalStore = useGlobalStore();
const userStore = useUserStore();

//function
const handleSubmit = async () => {
  try {
    error.value = "";
    globalStore.startLoading();
    const { valid } = await form!.value!.validate();
    if (!valid) return;
    await userStore.authenticate(loginForm.value);
    await useRouter().push("/");
    loginForm.value = {
      email: "",
      password: "",
    };
  } catch (e: any) {
    const err: FetchError = e;
    if (err.statusCode != 500) {
      if (err.statusMessage) {
        error.value = err.statusMessage;
      } else {
        error.value = "Not a fatal error, but we can't find the problem, please contact luca-lucidera on github";
      }
    } else {
      error.value = "Something went wrong";
    }
  } finally {
    globalStore.stopLoading();
  }
};
</script>
