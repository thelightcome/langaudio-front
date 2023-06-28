<template>
  <div class="w-full pt-10">
    <UiBackSlash :path="$localePath('/')" />
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
        <div class="flex items-end gap-4 mb-2">
          <UiInputField
            v-model="values.name.value"
            :name="'Name'"
            :type="'text'"
            :error="errors.name.value"
            @blur="check('name')"
          />
          <LanguagesSelectorMain
            class="min-w-[200px]"
            :model-value="values.lang.value"
            @update:model-value="values.lang.value = $event"
          />
        </div>
        <div class="flex items-end gap-4 mb-2">
          <UiInputField
            v-model="values.implementor.value"
            :name="'Implementor'"
            :type="'text'"
            :error="errors.implementor.value"
            @blur="check('implementor')"
          />
          <CountriesSelectorMain
            class="min-w-[200px]"
            :model-value="values.country.value"
            @update:model-value="values.country.value = $event"
          />
          <UiButton @click="addImpl">Add</UiButton>
        </div>
        <div class="mt-4 mb-5">
          <div
            v-for="(implementor, implementorInd) in implementors"
            :key="implementorInd"
            class="text-light flex justify-between items-center"
          >
            <div>{{ implementor.name }}</div>
            <button
              class="cursor-pointer px-2 border-none bg-transparent"
              @click="removeImple(implementorInd)"
            >
              <IconTrash class="w-4 h-4" />
            </button>
          </div>
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
import IconTrash from "~/assets/icons/trash.svg?component";

import { useModalStore } from "~/store/modal";

import { IImplementorCreate } from "~/types/implementors.types";

definePageMeta({
  middleware: ["auth-middleware"],
});

const { t: $tc } = useI18n();
const modalStore = useModalStore();
const $api = useApiHook();
const $localePath = useLocalePath();

const { values, errors, isValid, check, handleSubmit } = useFormHook({
  name: { init: "", required: true, min: 1 },
  lang: { init: [], required: true },
  implementor: { init: "" },
  country: { init: [], required: true },
  text: { init: "", required: true, min: 5 },
  srcYoutube: { init: "" },
});

const implementors = ref<IImplementorCreate[]>([]);

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

const { loading, error, request } = useRequestHook(async (data: any) => {
  const sendData = {
    name: data.name.value,
    langs: data.lang.value.map((e: any) => e.id),
    implementors: implementors.value,
    text: data.text.value,
    srcYoutube: parseYoutubeUrl.value,
  };

  {
    const data = await $api.source.create(sendData);
    if (data.message) {
      modalStore._openModal("ModalSuccess", $tc(data.message));
    }
    clearAll();
  }
});

function addImpl() {
  if (!values.country.value?.length || !values.implementor.value) {
    errors.implementor.value = "This field is required";
    return;
  }
  implementors.value.push({
    name: values.implementor.value,
    countries: values.country.value.map((c: any) => c.name),
  });
  values.implementor.value = "";
  values.country.value = [];
}

function clearAll() {
  values.name.value = "";
  values.text.value = "";
  values.srcYoutube.value = "";
}

function removeImple(impleInd: number) {
  implementors.value.splice(impleInd, 1);
}
</script>
