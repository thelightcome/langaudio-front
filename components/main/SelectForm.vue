<template>
  <div class="p-5 rounded-md border border-light-300">
    <div class="flex gap-4 mb-2">
      <UiButton
        type="text"
        class="px-2"
        :class="{ underline: tabType === 'impl' }"
        @click="tabType = 'impl'"
        >Implementors</UiButton
      >
      <UiButton
        type="text"
        class="px-2"
        :class="{ underline: tabType === 'song' }"
        @click="tabType = 'song'"
        >Songs</UiButton
      >
    </div>
    <div class="w-full flex flex-col justify-start items-stretch">
      <template v-if="tabType === 'impl'">
        <MainSelectCountries v-model="selectedCountry" class="mb-6" />
        <MainSelectImplementors
          v-model="selectedImplementor"
          :country="selectedCountry"
        />
      </template>
      <template v-else-if="tabType === 'song'">
        <MainSelectLangs v-model="selectedLang" class="mb-6" />
        <MainSelectSongs v-model="selectedSong" :lang="selectedLang" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ICountry } from "~/types/countries.types";
import { ILanguage } from "~/types/languages.types";
import { IImplementor } from "~/types/implementors.types";

const tabType = ref("impl");

const emits = defineEmits(["fetchImplementor", "fetchSong"]);

const selectedCountry = ref<ICountry | null>(null);
const selectedLang = ref<ILanguage | null>(null);
const selectedImplementor = ref<IImplementor | null>(null);
const selectedSong = ref("");

watch(
  () => selectedImplementor.value,
  () => emits("fetchImplementor", selectedImplementor.value?.name)
);

watch(
  () => selectedSong.value,
  () => emits("fetchSong", selectedSong.value)
);
</script>
