<template>
  <div class="pt-10 flex flex-col justify-between items-start gap-4 flex-wrap">
    <UiBackSlash />
    <template v-if="translate">
      <UiText v-if="translate.lang" class="mb-4">
        Language - {{ translate.lang.name }}
      </UiText>
      <div v-if="translate.source" class="w-full flex flex-col sm:flex-row">
        <div class="grow max-w-[450px] mb-10">
          <div class="flex justify-between items-center pr-[10%] mb-4">
            <UiText level="h5"
              >{{ translate.source.implementors[0].name }} -
              {{ translate.source.name }}</UiText
            >
          </div>
          <UiText>
            <div v-html="sourceText"></div>
          </UiText>
        </div>
        <div class="grow max-w-[450px]">
          <div class="flex justify-between items-center pr-[10%] mb-4">
            <UiText level="h5">{{ translate.name }}</UiText>
          </div>
          <UiText>
            <div v-html="translateText"></div>
          </UiText>
        </div>
      </div>
      <div class="w-full">
        <UiButton :disabled="loadingDel" @click="requestDelete"
          >Delete</UiButton
        >
        <UiText
          v-if="(error && error.message) || (errorDel && errorDel.message)"
          class="text-error mb-2"
          >{{ error?.message || errorDel?.message }}</UiText
        >
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ITranslate } from "~/types/translates.types";

const localePath = useLocalePath();
const $api = useApiHook();
const router = useRouter();
const route = useRoute();

const translateId = computed(() => {
  return decodeURI(route.params.id as string);
});

const translate = ref<ITranslate | null>(null);

const sourceText: ComputedRef<string> = computed(() => {
  return translate.value?.source
    ? translate.value.source.text.replaceAll("\n", "<br />")
    : "";
});

const translateText: ComputedRef<string> = computed(() => {
  return translate.value ? translate.value.text.replaceAll("\n", "<br />") : "";
});

const { error, request } = useRequestHook(async () => {
  if (!translateId.value) return;
  const res = await $api.translate.findOne(translateId.value);

  if (res) translate.value = res;
});

const {
  error: errorDel,
  loading: loadingDel,
  request: requestDelete,
} = useRequestHook(async () => {
  if (!translateId.value) return;
  try {
    await $api.translate.delete(translateId.value);
    router.push(localePath("/admin/translates"));
  } catch (e: any) {}
});

onMounted(() => {
  request();
});
</script>
