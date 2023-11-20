<script setup lang="ts">
import type { UserLoginDTO } from "~/types/user/userLoginDTO";
import type { VForm } from "vuetify/components/VForm";
const loginState = useState<UserLoginDTO>(() => ({ email: "", password: "" }));
const error = useState<string>(() => "");
const form = useState<VForm | null>(() => null);

const globalStore = useGlobalStore();
const userStore = useUserStore();

const login = async () => {
  error.value = "";
  globalStore.startLoading();
  try {
    const { valid, errors: validationError } = await form!.value!.validate();
    if (!valid) {
      globalStore.showSnackbar("Errore di VALIDAZIONE", "error");
      console.debug({ validationError });
      return;
    }
    const authResult = await userStore.authenticate(loginState.value);
    if (!authResult.success) {
      globalStore.showSnackbar("Errore di AUTENTICAZIONE", "error");
      error.value = authResult.errorData;
      return;
    }
    globalStore.showSnackbar("Login effettuato", "success");
    await useRouter().push("/");
    loginState.value = { email: "", password: "" };
  } catch (error) {
    console.log("Errore non previsto:", { error });
  } finally {
    globalStore.stopLoading();
  }
};
</script>

<template>
  <VContainer class="h-100 d-flex flex-column justify-center">
    <VContainer class="text-center mb-16">
      LIBRERIA x <VIcon>mdi-nuxt</VIcon> x <VIcon>$vuetify</VIcon>
    </VContainer>
    <VForm
      class="d-flex flex-column justify-center pb-12"
      @submit.prevent="login"
      ref="form"
    >
      <VTextField
        v-model="loginState.email"
        type="email"
        variant="outlined"
        label="EMAIL"
        append-inner-icon="mdi-email"
        color="primary"
        :rules="rules.auth.email"
      />
      <VTextField
        v-model="loginState.password"
        type="password"
        variant="outlined"
        label="PASSWORD"
        append-inner-icon="mdi-lock"
        color="primary"
        :rules="rules.auth.password"
      />
      <VBtn
        class="rounded-lg mx-14"
        color="primary"
        variant="tonal"
        type="submit"
        >Login</VBtn
      >
      <VBtn class="rounded-lg mx-14 mt-8" color="secondary" variant="text"
        >Register</VBtn
      >
      <span style="color: red;">{{ error }}</span>
    </VForm>
  </VContainer>
</template>
