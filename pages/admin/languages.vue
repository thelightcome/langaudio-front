<template>
  <div class="pt-4">
    <UiBackSlash />
    <div class="relative mb-5">
      <p class="mb-4 text-dark-font">Form Add Languages</p>
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
          v-if="values.code"
          v-model="values.code.value"
          :name="'Languages Code'"
          :type="'text'"
          :error="errors.code.value"
          @blur="check('code')"
        />
        <UiButton
          :disabled="loading || !isValid"
          @click="handleSubmit($event, request)"
          >Send</UiButton
        >
        <UiButton
          :disabled="loadingUpdate"
          @click="
            requestUpdate({ name: values.name.value, code: values.code.value })
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
        <p class="text-dark-font">{{ language.name }}</p>
        <div class="flex flex-row">
          <UiButton @click="selectCurrent(language)">Select</UiButton>
          <UiButton
            :disabled="loadingDelete"
            @click="requestDelete(language.code)"
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
const languageStore = useLanguageStore();
onMounted(async () => {
  await languageStore._fetchLanguages();
});

const { values, errors, isValid, check, handleSubmit, clear } = useFormHook({
  code: { required: true },
  name: { required: true },
});

const { loading, error, request } = useRequestHook(async (data: any) => {
  const sendData = {
    code: data.code.value.toLowerCase(),
    name: data.name.value.toLowerCase(),
  };
  await $api.langs.create(sendData);
  clear();
  await languageStore._fetchLanguages();
});

const selectedLanguage = ref("");

function selectCurrent(selected: ILanguage) {
  values.name.value = selected.name;
  values.code.value = selected.code;
  selectedLanguage.value = selected.code;
}

const { loading: loadingUpdate, request: requestUpdate } = useRequestHook(
  async (lang: ILanguage) => {
    if (!selectedLanguage.value) return;
    await $api.langs.update(selectedLanguage.value, lang);
    selectedLanguage.value = "";
    await languageStore._fetchLanguages();
  }
);

const { loading: loadingDelete, request: requestDelete } = useRequestHook(
  async (code: string) => {
    await $api.langs.delete(code);
    await languageStore._fetchLanguages();
  }
);
</script>
