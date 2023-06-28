<template>
  <div class="pt-4">
    <UiBackSlash :path="$localePath('/admin')" />
    <div class="relative mb-5">
      <p class="mb-4 text-light">Form Add Languages</p>
      <form class="flex items-center gap-4" @submit.prevent="">
        <UiInputField
          v-if="values.name"
          v-model="values.name.value"
          :name="'Language Name'"
          :type="'text'"
          :error="errors.name.value"
          @blur="check('name')"
        />
        <UiInputField
          v-if="values.codeiso"
          v-model="values.codeiso.value"
          :name="'Languages Code'"
          :type="'text'"
          :error="errors.codeiso.value"
          @blur="check('codeiso')"
        />
        <UiButton
          :disabled="loading || !isValid"
          @click="handleSubmit($event, request)"
          >Send</UiButton
        >
        <UiButton
          :disabled="loadingUpdate"
          @click="
            requestUpdate({
              name: values.name.value,
              codeiso: values.codeiso.value,
            })
          "
          >Update</UiButton
        >
      </form>
      <div v-show="error">{{ error }}</div>
    </div>
    <div>
      <div
        v-for="language in languageStore._getLanguages"
        :key="language.name"
        class="flex flex-row justify-between items-center"
      >
        <p class="text-light">{{ language.name }}</p>
        <div class="flex flex-row">
          <UiButton @click="selectCurrent(language)">Select</UiButton>
          <UiButton
            :disabled="loadingDelete"
            @click="requestDelete(language.id)"
            >Delete</UiButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLanguageStore } from "~/store/languages";

import { ILanguage } from "~/types/languages.types";

const $api = useApiHook();
const $localePath = useLocalePath();
const languageStore = useLanguageStore();
onMounted(async () => {
  await languageStore._fetchLanguages();
});

const { values, errors, isValid, check, handleSubmit, clear } = useFormHook({
  codeiso: { required: true },
  name: { required: true },
});

const { loading, error, request } = useRequestHook(async (data: any) => {
  const sendData = {
    codeiso: data.codeiso.value.toLowerCase(),
    name: data.name.value.toLowerCase(),
  };
  await $api.langs.create(sendData);
  clear();
  await languageStore._fetchLanguages();
});

const selectedLanguage = ref<number | null>(null);

function selectCurrent(selected: ILanguage) {
  values.name.value = selected.name;
  values.codeiso.value = selected.codeiso;
  selectedLanguage.value = selected.id;
}

const { loading: loadingUpdate, request: requestUpdate } = useRequestHook(
  async (lang: ILanguage) => {
    if (!selectedLanguage.value) return;
    await $api.langs.update(selectedLanguage.value, lang);
    selectedLanguage.value = null;
    await languageStore._fetchLanguages();
  }
);

const { loading: loadingDelete, request: requestDelete } = useRequestHook(
  async (id: number) => {
    await $api.langs.delete(id);
    await languageStore._fetchLanguages();
  }
);
</script>
