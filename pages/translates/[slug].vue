<template>
  <div class="pt-10 flex flex-col justify-between items-start gap-4 flex-wrap">
    <UiBackSlash />
    <template v-if="source">
      <div class="w-full flex flex-col sm:flex-row">
        <div class="grow max-w-[450px] mb-10">
          <div class="flex justify-between items-center pr-[10%] mb-4">
            <UiText level="h5"
              >{{ source.implementors[0].name }} - {{ source.name }}</UiText
            >
          </div>
          <UiText>
            <div v-html="sourceText"></div>
          </UiText>
        </div>
        <div class="grow max-w-[450px]">
          <MainSelectLangs
            v-model="values.selectedLang.value"
            :error="errors.selectedLang.value"
            class="max-w-[200px] mb-4"
          />
          <UiInputField
            v-if="values.name"
            v-model="values.name.value"
            :name="'Name'"
            :type="'text'"
            :error="errors.name.value"
            class="mb-4"
            @blur="check('name')"
          />
          <UiTextarea
            v-if="values.text"
            v-model="values.text.value"
            :name="'Text'"
            :error="errors.text.value"
            class="md:mb-6"
            @blur="check('text')"
          />
        </div>
      </div>
      <div class="w-full">
        <UiButton
          :disabled="loading || !isValid"
          @click="handleSubmit($event, request)"
          >Send</UiButton
        >
        <UiText v-if="error && error.message" class="text-error mb-2">{{
          error.message
        }}</UiText>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useSourcesStore } from "~/store/sources";

import { ISource } from "~/types/sources.types";

definePageMeta({
  middleware: ["auth-middleware"],
});

const $api = useApiHook();
const { t: $tc } = useI18n();
const route = useRoute();
const sourcesStore = useSourcesStore();
const modalStore = useModalStore();

const source: ComputedRef<ISource | undefined> = computed(() => {
  return sourcesStore.sources.find(
    (e: { id: number }) => e.id === +route.params.slug
  );
});

const sourceText: ComputedRef<string> = computed(() => {
  return source.value ? source.value.text.replaceAll("\n", "<br />") : "";
});

const { values, errors, isValid, check, handleSubmit, clear } = useFormHook({
  name: { init: "", required: true, min: 1 },
  text: { init: "", required: true, min: 20 },
  selectedLang: { init: null, required: true },
});

const { loading, error, request } = useRequestHook(async (data: any) => {
  const res = await $api.translate.create({
    name: data.name.value,
    text: data.text.value,
    langCode: data.selectedLang.value.code,
    sourceId: +route.params.slug,
  });
  if (res.message) {
    modalStore._openModal("ModalSuccess", $tc(res.message));
  }
  clear();
});
</script>
