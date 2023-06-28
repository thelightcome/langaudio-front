<template>
  <SelectUi
    :model-value="modelValue"
    :label="'Languages'"
    :options="languages"
    :field="'name'"
    :multiple="multiple"
    @update:model-value="select($event)"
  />
</template>

<script lang="ts" setup>
import { useLanguageStore } from "~/store/languages";

import { ILanguage } from "~/types/languages.types";

const languageStore = useLanguageStore();

withDefaults(
  defineProps<{
    multiple?: boolean;
    modelValue: ILanguage[] | null;
  }>(),
  {
    multiple: true,
  }
);

const emits = defineEmits(["update:modelValue"]);

const languages = computed(() => {
  return languageStore._getLanguages;
});

onMounted(async () => {
  await languageStore._fetchLanguages();
});

function select(languages: any[]) {
  emits("update:modelValue", languages);
}
</script>
