<template>
  <div class="w-full pt-12">
    <UiBackSlash />
    <form @submit.prevent="">
      <div class="flex gap-4 mb-2">
        <UiInputField
          v-if="values.name"
          v-model="values.name.value"
          :name="'Name'"
          :type="'text'"
          :error="errors.name.value"
          @blur="check('name')"
        />
        <MainSelectLangs v-model="values.lang.value" />
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
        <MainSelectCountries v-model="values.country.value" />
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
          <div class="flex justify-between items-stretch">
            <UiButton @click="tabType = 'image'">Image</UiButton>
            <UiButton @click="tabType = 'youtube'">YouTube</UiButton>
            <UiButton @click="tabType = 'audio'">Audio</UiButton>
            <UiButton @click="tabType = 'video'">Video</UiButton>
          </div>
          <UiVideo
            v-show="tabType === 'audio'"
            :video="false"
            :src="audioFileSrc"
            :width="'400px'"
            :height="'70px'"
          />
          <iframe
            v-show="tabType === 'youtube' && values.srcYoutube"
            type="text/html"
            width="400"
            height="300"
            :src="values.srcYoutube.value"
            frameborder="0"
          ></iframe>
          <UiVideo
            v-show="tabType === 'video'"
            :src="videoFileSrc"
            :width="'400px'"
            :height="'300px'"
          />
          <NuxtImg
            v-show="tabType === 'image'"
            class="w-full h-full object-contain"
            :src="imgFileSrc || 'sdfs'"
            alt=""
          />
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
  </div>
</template>

<script lang="ts" setup>
import { useSourcesStore } from "~/store/sources";

const $api = useApiHook();
const localePath = useLocalePath();
const route = useRoute();
const router = useRouter();
const sourceStore = useSourcesStore();

const tabType = ref("image");

const selectedSource = computed(() => {
  return sourceStore._getSources.find((e) => e.id === +route.params.id);
});

const audioFileSrc = ref("");
const videoFileSrc = ref("");
const imgFileSrc = ref("");
const { values, errors, isValid, check, handleSubmit } = useFormHook({
  name: { init: "", required: true, min: 1 },
  lang: { init: "", required: true },
  implementor: { init: "", required: true, min: 1 },
  country: { init: { name: "" }, required: true },
  text: { init: "", required: true, min: 5 },
  srcYoutube: { init: "" },
});

onMounted(() => {
  if (!selectedSource.value) return;
  audioFileSrc.value = selectedSource.value.srcAudio;
  videoFileSrc.value = selectedSource.value.srcVideo;
  imgFileSrc.value = selectedSource.value.img;
  values.name.value = selectedSource.value.name;
  values.lang.value = selectedSource.value.lang;
  values.implementor.value = selectedSource.value.implementors[0].name;
  values.country.value = {
    name: selectedSource.value.implementors[0].countryName,
  };
  values.text.value = selectedSource.value.text;
  values.srcYoutube.value = selectedSource.value.srcYoutube;
});

const { loading, error, request } = useRequestHook(async () => {
  if (!selectedSource.value) return;
  await await $api.source.verify(selectedSource.value.id, {
    name: values.name.value,
    text: values.text.value,
    langCode: values.lang.value.code,
    implementors: {
      name: values.implementor.value.name,
      countryName: values.country.value.name,
    },
  });
  redirectToList();
});

async function deleteSource() {
  if (!selectedSource.value) return;
  await $api.source.delete(selectedSource.value.id);
  redirectToList();
}

function redirectToList() {
  router.push(localePath("/admin/sources"));
}
</script>
