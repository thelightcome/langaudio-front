<template>
  <UiSelectAsync
    :value="modelValue?.name"
    :title="'Languages'"
    :items="items"
    :error="error"
    @select="select"
  />
</template>

<script lang="ts" setup>
import { useLanguageStore } from "~/store/languages";

import { ILanguage } from "~/types/languages.types";

const languageStore = useLanguageStore();

defineProps<{
  modelValue: ILanguage | null;
  error?: string;
}>();

const emits = defineEmits(["update:modelValue"]);

const items = computed(() => {
  return languageStore._getLanguages.map((v) => v.name);
});

onMounted(async () => {
  await languageStore._fetchLanguages();
});

function select(name: string) {
  const lang = languageStore._getLanguages.find((e) => e.name === name);
  emits("update:modelValue", lang);
}
</script>
