<template>
  <div class="w-full pt-12">
    <UiBackSlash :path="$localePath('/admin/sources')" />
    <template v-if="selectedSource">
      <form @submit.prevent="">
        <div class="flex gap-4 mb-2">
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
        <div class="flex gap-4 mb-2">
          <UiInputField
            v-if="values.implementor"
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
        <div class="grow flex justify-between items-start gap-5 mb-4">
          <UiTextarea
            v-if="values.text"
            v-model="values.text.value"
            :name="'Text'"
            :error="errors.text.value"
            class="grow basis-80"
            @blur="check('text')"
          />
          <div class="grow basis-80">
            <object
              v-show="values.srcYoutube"
              width="400"
              height="300"
              :data="values.srcYoutube.value"
            ></object>
          </div>
        </div>
      </form>
      <div class="w-full">
        <div class="flex gap-2">
          <UiButton
            :disabled="loading || !isValid"
            @click="handleSubmit($event, request)"
            >Send</UiButton
          >
          <UiButton :disabled="loading || !isValid" @click="deleteSource"
            >Delete</UiButton
          >
        </div>
        <UiText v-if="error && error.message" class="text-error mb-2">{{
          error.message
        }}</UiText>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import IconTrash from "~/assets/icons/trash.svg?component";

import { useSourcesStore } from "~/store/sources";

import { IImplementorCreate } from "~/types/implementors.types";

const $api = useApiHook();
const $localePath = useLocalePath();
const route = useRoute();
const router = useRouter();
const sourceStore = useSourcesStore();

const selectedSource = computed(() => {
  return sourceStore._getSources.find((e) => e.id === +route.params.id);
});

const { values, errors, isValid, check, handleSubmit } = useFormHook({
  name: { init: "", required: true, min: 1 },
  lang: { init: [] },
  implementor: { init: "" },
  country: { init: [] },
  text: { init: "", required: true, min: 5 },
  srcYoutube: { init: "" },
});

const implementors = ref<IImplementorCreate[]>([]);

onMounted(() => {
  if (!selectedSource.value) return;
  values.name.value = selectedSource.value.name;
  values.lang.value = selectedSource.value.langs;
  implementors.value = selectedSource.value.implementors.map((e) => ({
    ...e,
    countries: e.countries.map((c) => c.name),
  }));
  values.text.value = selectedSource.value.text;
  values.srcYoutube.value = selectedSource.value.srcYoutube;
});

const { loading, error, request } = useRequestHook(async () => {
  if (!selectedSource.value) return;
  await await $api.source.verify(selectedSource.value.id, {
    name: values.name.value,
    text: values.text.value,
    langs: values.lang.value.map((l: any) => l.id),
    implementors: implementors.value.map((i) => {
      return {
        name: i.name,
        countries: i.countries,
      };
    }),
  });
  redirectToList();
});

async function deleteSource() {
  if (!selectedSource.value) return;
  await $api.source.delete(selectedSource.value.id);
  redirectToList();
}

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

function redirectToList() {
  router.push($localePath("/admin/sources"));
}

function removeImple(impleInd: number) {
  implementors.value.splice(impleInd, 1);
}
</script>
