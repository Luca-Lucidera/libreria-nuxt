<script lang="ts" setup>
import { VForm } from "vuetify/components/VForm";
import type { UserLoginDTO } from "~/types/user/userLoginDTO";
import { useDisplay } from 'vuetify'

//page state
const loginForm = useState<UserLoginDTO>(() => {
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
    const result = await userStore.authenticate(loginForm.value);
    if (result.success) {
      await useRouter().push("/");
      loginForm.value = {
        email: "",
        password: "",
      };
    } else {
      if (result.errorData) {
        error.value = result.errorData;
      } else {
        error.value = "Errore non previsto, riprovare più tardi";
      }
    }
  } finally {
    globalStore.stopLoading();
  }
};
</script>

<template>
  <VContainer class="h-100 d-flex justify-center align-center" v-if="!useDisplay().xs.value">
    <VCard class="w-50 rounded-xl">
      <VCardTitle class="text-center my-4 text-primary">LOGIN</VCardTitle>
      <VForm @submit.prevent="handleSubmit" ref="form">
        <VCardItem>
          <VTextField
            v-model="loginForm.email"
            :rules="rules.auth.email"
            color="primary"
            label="Email"
            prependIcon="mdi-email"
            type="email"
            variant="underlined"
          />
        </VCardItem>
        <VCardItem>
          <VTextField
            v-model="loginForm.password"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="rules.auth.password"
            :type="showPassword ? 'text' : 'password'"
            color="primary"
            label="Password"
            prependIcon="mdi-lock"
            variant="underlined"
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
            variant="tonal"
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
            elevation="18"
            rounded="lg"
            width="auto"
            to="/register"
            >REGISTER
          </VBtn>
        </VCardActions>
      </VForm>
    </VCard>
  </VContainer>
  <MobileLogin v-else />
</template>
