<template>
  <div class="overflow-auto scrollbar-sweet flex justify-center pt-5">
    <form
      class="w-[400px] flex flex-col justify-start align-center px-8 pt-4 pb-6 m-auto"
      @submit.prevent=""
    >
      <UiText :level="'h2'" :component="'h2'" class="text-center mb-4">{{
        title
      }}</UiText>
      <UiInputField
        v-if="values.email"
        v-model="values.email.value"
        :name="'Email'"
        :type="'email'"
        :error="errors.email.value"
        class="mb-6"
        @blur="check('email')"
      />
      <UiInputField
        v-if="values.password"
        v-model="values.password.value"
        :name="'Password'"
        :type="'password'"
        :error="errors.password.value"
        class="mb-6"
        @blur="check('password')"
      />
      <UiInputField
        v-if="values.confirmPassword"
        v-model="values.confirmPassword.value"
        :name="'Confirm Password'"
        :type="'password'"
        :error="errors.confirmPassword.value"
        class="mb-6"
        @blur="check('confirmPassword')"
      />
      <UiButton
        class="mb-2"
        :disabled="loading || !isValid"
        @click="handleSubmit($event, request)"
        >Send</UiButton
      >
      <UiText v-if="error && error.message" class="text-error mb-2">{{
        error.message
      }}</UiText>
      <UiButton
        v-if="route.params.type === 'signin'"
        v-show="values.email.value && !errors.email.value"
        :type="'text'"
        :disabled="loadSendLink"
        @click="requestSendLink"
        >Send link for respawn</UiButton
      >
    </form>
  </div>
</template>

<script lang="ts" setup>
import { TypeKeysAuth } from "~/repository/modules/auth";
import { useModalStore } from "~/store/modal";

definePageMeta({
  middleware: ["auth-middleware"],
  validate: (route) => {
    const pages = ["signin", "signup", "refresh", "verify"];
    if (pages.includes(route.params.type as string)) return true;
    return false;
  },
});

const $api = useApiHook();
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
const { t: $tc } = useI18n();
const { $auth } = useNuxtApp();
const modalStore = useModalStore();

const option = reactive({
  token: route.params.type === "refresh" || route.params.type === "verify",
  email: route.params.type === "signin" || route.params.type === "signup",
  confirmPassword:
    route.params.type === "refresh" || route.params.type === "signup",
});

const title = computed(() => {
  return $tc(`auth.titles.${route.params.type}`);
});

const { values, errors, isValid, check, handleSubmit, clear } = useFormHook({
  ...(option.email && { email: { type: "email" } }),
  password:
    route.params.type === "signup" || route.params.type === "refresh"
      ? { type: "password" }
      : { required: true },
  ...(option.confirmPassword && {
    confirmPassword: { type: "same", isSame: { field: "password" } },
  }),
});

const { loading, error, request } = useRequestHook(async (data: any) => {
  if (!route.query.token && option.token) return;
  const sendData = {
    ...(option.email && { email: data.email.value }),
    ...(option.token && { token: route.query.token }),
    password: data.password.value,
  };
  if (
    typeof route.params.type === "string" &&
    $api.auth[route.params.type as TypeKeysAuth] &&
    typeof $api.auth[route.params.type as TypeKeysAuth] === "function"
  ) {
    const data = await $auth.wrapEndpoint(async () => {
      const res = await ($api.auth[route.params.type as TypeKeysAuth] as any)(
        sendData
      );
      return res;
    });
    if (data.message) {
      modalStore._openModal("ModalSuccess", $tc(data.message));
    }
    if (route.params.type === "refresh") {
      router.push(localePath("/auth/signin"));
    }
    clear();
  }
});

const { loading: loadSendLink, request: requestSendLink } = useRequestHook(
  async () => {
    try {
      const data = await $api.auth.sendLink({
        email: values.email.value,
      });
      if (data.message) {
        modalStore._openModal("ModalSuccess", $tc(data.message));
      }
      clear();
    } catch (e) {}
  }
);
</script>
