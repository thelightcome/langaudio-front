<template>
  <div class="pt-10 flex flex-col justify-between items-start gap-4 flex-wrap">
    <UiBackSlash />
    <template v-if="source">
      <div class="w-full flex flex-col sm:flex-row">
        <div class="grow max-w-[450px] mb-10">
          <div class="flex justify-between items-center pr-[10%] mb-4">
            <UiText level="h5"
              ><span
                v-for="(implementor, implementorInd) in source.implementors"
                :key="implementorInd"
                >{{ implementor.name }}</span
              >
              - {{ source.name }}</UiText
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
import { IListDataRes } from "~/types/common.types";
import { ISource } from "~/types/sources.types";

definePageMeta({
  middleware: ["auth-middleware"],
});

const $api = useApiHook();
const { t: $tc } = useI18n();
const route = useRoute();
const modalStore = useModalStore();

const source = ref<ISource | null>(null);

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
    langId: data.selectedLang.value.id,
    sourceId: +route.params.slug,
  });
  if (res.message) {
    modalStore._openModal("ModalSuccess", $tc(res.message));
  }
  clear();
});

onMounted(async () => {
  try {
    const response: IListDataRes<ISource> = await $api.source.findAll({
      id: +route.params.slug,
    });
    source.value =
      (response.rows || []).find(
        (e: { id: number }) => e.id === +route.params.slug
      ) || null;
  } catch (err) {}
});
</script>
