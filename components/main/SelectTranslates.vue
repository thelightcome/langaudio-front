<template>
  <UiSelectAsync
    :loading="loading"
    :value="modelValue?.name"
    :title="'Translates'"
    :items="items"
    :can-load="canLoad"
    :error="error"
    @load="request"
    @select="select"
  />
</template>

<script lang="ts" setup>
import { ISource } from "~/types/sources.types";
import { ILanguage } from "~/types/languages.types";
import { ITranslate } from "~/types/translates.types";

const props = defineProps<{
  lang: ILanguage | null;
  source: ISource | null;
  modelValue: ITranslate | null;
  error?: string;
}>();

const emits = defineEmits(["update:modelValue"]);

const $api = useApiHook();

const translateCount = ref(0);
const translates = reactive<ITranslate[]>([]);

const items = computed(() => {
  return translates.map((e) => e.name);
});

const canLoad = computed(() => {
  return translates.length === 0 || translates.length < translateCount.value;
});

const { loading, request } = useRequestHook(async () => {
  if (!props.source?.id || !props.lang?.code) return;
  const response = await $api.translate.findAll({
    sourceId: props.source?.id,
    langCode: props.lang?.code,
    offset: translates.length,
    limit: 10,
  });
  translateCount.value = response.count;
  translates.push(...response.rows);
});

function select(v: string) {
  const elem = translates.find((e) => e.name === v);
  emits("update:modelValue", elem);
}
</script>
