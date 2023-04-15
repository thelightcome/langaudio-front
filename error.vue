<template>
  <NuxtLayout>
    <div
      v-if="error"
      class="min-h-full box-border px-16 flex flex-col justify-center items-center text-center"
    >
      <UiText :level="'h1'" :component="'div'" class="text-8xl mb-10">{{
        error.statusCode
      }}</UiText>
      <UiText class="text-3xl max-w-[800px] mb-14">{{ error.message }}</UiText>
      <UiButton class="mb-32" @click="handleError">Go to back</UiButton>
    </div>
  </NuxtLayout>
</template>

<script setup>
defineProps({
  error: {
    type: Object,
    required: true,
  },
});

const error = useError();
if (error?.value?.statusCode === 404) {
  error.value.message = "Oops! Page not found 😔";
}

const router = useRouter();
const handleError = () => {
  clearError();
  router.back();
};
</script>
