<template>
  <div class="w-full pt-10">
    <UiBackSlash />
    <UiText
      :level="'h2'"
      :component="'h2'"
      class="text-center md:text-left mb-6"
      >Add</UiText
    >
    <form
      class="flex flex-row justify-between items-stretch flex-wrap gap-x-8 gap-y-6"
      @submit.prevent=""
    >
      <div class="basis-80 grow">
        <div class="flex gap-4 mb-2">
          <UiInputField
            v-if="values.name"
            v-model="values.name.value"
            :name="'Name'"
            :type="'text'"
            :error="errors.name.value"
            @blur="check('name')"
          />
          <MainSelectLangs
            v-model="values.lang.value"
            :error="errors.lang.value"
            class="max-w-[200px]"
          />
        </div>
        <div class="flex gap-4 mb-2">
          <UiInputField
            v-if="values.implementor"
            v-model="values.implementor.value"
            :name="'Implementor'"
            :type="'text'"
            :error="errors.implementor.value"
            @blur="check('implementor')"
          />
          <MainSelectCountries
            v-model="values.country.value"
            :error="errors.country.value"
            class="max-w-[200px]"
          />
        </div>
        <UiTextarea
          v-if="values.text"
          v-model="values.text.value"
          :name="'Text'"
          :error="errors.text.value"
          class="md:mb-6"
          @blur="check('text')"
        />
      </div>
      <div
        class="basis-80 grow flex flex-row justify-between items-stretch flex-wrap"
      >
        <div class="w-full mb-2">
          <UiInputField
            v-show="values.srcYoutube"
            v-model="values.srcYoutube.value"
            :name="'YouTube resource'"
            :type="'text'"
            :error="errors.srcYoutube.value"
            class="mb-4"
            @blur="check('srcYoutube')"
          />
        </div>
      </div>
    </form>
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
  </div>
</template>

<script lang="ts" setup>
import { useModalStore } from "~/store/modal";

definePageMeta({
  middleware: ["auth-middleware"],
});

const { t: $tc } = useI18n();
const modalStore = useModalStore();
const $api = useApiHook();

const { values, errors, isValid, check, handleSubmit, clear } = useFormHook({
  name: { init: "", required: true, min: 1 },
  lang: { init: "", required: true },
  implementor: { init: "", required: true, min: 1 },
  country: { init: { name: "" }, required: true, custom: (v) => !!v.name },
  text: { init: "", required: true, min: 5 },
  srcYoutube: { init: "" },
});

const parseYoutubeUrl = ref("");

watch(
  () => values.srcYoutube.value,
  () => {
    let src = "";
    if (values.srcYoutube.value.includes("v="))
      src = `https://www.youtube.com/embed/${values.srcYoutube.value
        .split("v=")
        .pop()}`;
    else if (values.srcYoutube.value.includes("youtu.be"))
      src = `https://www.youtube.com/embed/${values.srcYoutube.value
        .split("/")
        .pop()}`;
    else src = "";
    if (!src) errors.srcYoutube.value = "invalid src";
    parseYoutubeUrl.value = src;
  }
);

function clearAll() {
  clear();
  parseYoutubeUrl.value = "";
}

const { loading, error, request } = useRequestHook(async (data: any) => {
  const formData = new FormData();
  formData.append("name", data.name.value);
  formData.append("langCode", data.lang.value.code);
  formData.append(
    "implementor",
    JSON.stringify({
      name: data.implementor.value,
      countryName: data.country.value.name,
    })
  );
  formData.append("text", data.text.value);
  formData.append("srcYoutube", parseYoutubeUrl.value);

  {
    const data = await $api.source.create(formData);
    if (data.message) {
      modalStore._openModal("ModalSuccess", $tc(data.message));
    }
    clearAll();
  }
});
</script>
