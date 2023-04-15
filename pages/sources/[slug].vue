<template>
  <div
    class="pt-10 flex flex-col-reverse md:flex-row justify-between items-start gap-4 flex-wrap"
  >
    <UiBackSlash />
    <template v-if="source">
      <div class="w-full md:basis-[50%]">
        <div class="border border-light-300 py-3 px-5 mb-4 w-full">
          <UiText class="mb-2">Settings</UiText>
          <div class="flex items-end mb-3">
            <MainSelectLangs
              v-model="selectedLang"
              class="max-w-[200px] mr-2"
            />
            <div
              class="flex items-end opacity-0 pointer-events-none"
              :class="{ 'opacity-100 pointer-events-auto': selectedLang }"
            >
              <button
                class="text-dark-font px-2 py-1 border-none rounded-sm duration-300 hover:bg-gray-200/10"
                :class="{ 'text-red-500 bg-gray-200/10': splitChar === ' ' }"
                @click="splitChar = ' '"
              >
                By word
              </button>
              <button
                class="text-dark-font px-2 py-1 border-none rounded-sm duration-300 hover:bg-gray-200/10"
                :class="{ 'text-red-500 bg-gray-200/10': splitChar === '\n' }"
                @click="splitChar = '\n'"
              >
                By sentence
              </button>
              <button
                class="text-dark-font px-2 py-1 border-none rounded-sm duration-300 hover:bg-gray-200/10"
                :class="{ 'text-red-500 bg-gray-200/10': splitChar === '-' }"
                @click="splitChar = '-'"
              >
                Show row
              </button>
            </div>
          </div>
          <div class="flex items-end gap-2">
            <MainSelectTranslates
              v-model="selectedTranslate"
              :source="source"
              :lang="selectedLang"
              class="max-w-[250px]"
            />
            <NuxtLink
              :to="localePath('/translates/' + route.params.slug)"
              class="text-dark-font flex items-center align-middle leading-none"
              alt="Add Translate"
              ><span class="text-3xl mr-2 align-middle leading-none">+</span>
              Add Your Translate</NuxtLink
            >
          </div>
        </div>
        <div>
          <div class="flex justify-between items-center md:pr-[10%] mb-4">
            <UiText level="h5"
              >{{ source.implementors[0].name }} - {{ source.name }}</UiText
            >
            <UiButton type="text" class="ml-3" @click="addToPlaylist"
              >Add To Playlist</UiButton
            >
          </div>
          <UiText @click="clickText"><div v-html="sourceText"></div></UiText>
        </div>
      </div>
      <div class="grow border border-light-300 py-3 px-5 w-full md:max-w-[45%]">
        <div class="flex items-stretch mb-5 gap-3">
          <button
            v-if="source.srcYoutube"
            class="flex justify-center items-center w-8 h-8 border-none cursor-pointer rounded-xl duration-300 p-2 hover:bg-gray-200/20"
            :class="{ 'bg-gray-200/20': curPlayerType === 'youtube' }"
            @click="curPlayerType = 'youtube'"
          >
            <IconYoutube class="fill-red-500" />
          </button>
          <button
            v-if="source.srcAudio"
            class="flex justify-center items-center w-8 h-8 border-none cursor-pointer rounded-xl duration-300 p-2 hover:bg-gray-200/20"
            :class="{ 'bg-gray-200/20': curPlayerType === 'audio' }"
            @click="curPlayerType = 'audio'"
          >
            <IconHeadphones class="fill-pink-600" />
          </button>
          <button
            v-if="source.srcVideo"
            class="flex justify-center items-center w-8 h-8 border-none cursor-pointer rounded-xl duration-300 p-2 hover:bg-gray-200/20"
            :class="{ 'bg-gray-200/20': curPlayerType === 'video' }"
            @click="curPlayerType = 'video'"
          >
            <IconVideoCamera class="fill-fuchsia-700" />
          </button>
        </div>
        <div class="w-full">
          <iframe
            v-if="source.srcYoutube"
            v-show="curPlayerType === 'youtube'"
            type="text/html"
            width="400"
            height="300"
            :src="source.srcYoutube"
            frameborder="0"
            class="w-full"
          ></iframe>
          <UiVideo
            v-if="source.srcAudio"
            v-show="curPlayerType === 'audio'"
            :src="source.srcAudio"
            :video="false"
          />
          <UiVideo
            v-if="source.srcVideo"
            v-show="curPlayerType === 'video'"
            :src="source.srcVideo"
            class="w-full"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import IconYoutube from "~/assets/icons/youtube.svg?component";
import IconHeadphones from "~/assets/icons/headphones.svg?component";
import IconVideoCamera from "~/assets/icons/video-camera.svg?component";

import { ILanguage } from "~/types/languages.types";
import { ISource } from "~/types/sources.types";

import { useSourcesStore } from "~/store/sources";
import { useModalStore } from "~/store/modal";

const localePath = useLocalePath();
const route = useRoute();
const sourcesStore = useSourcesStore();
const modalStore = useModalStore();

const source: ComputedRef<ISource | undefined> = computed(() => {
  return sourcesStore.sources.find(
    (e: { id: number }) => e.id === +route.params.slug
  );
});

const sourceText: ComputedRef<string> = computed(() => {
  return source.value ? source.value.text.replaceAll("\n", "<br />") : "";
});

const selectedLang = ref<ILanguage | null>(null);
const curPlayerType = ref("youtube");
const splitChar = ref(" ");
const selectedTranslate = ref(null);

function addToPlaylist() {
  modalStore._openModal("MainPlayListModal", source.value);
}

function clickText() {
  if (!source.value) return;
  if (splitChar.value === "-") return;
  const s = window.getSelection();
  if (s?.anchorOffset) {
    const splitter = splitChar.value === "\n" ? "\n" : /\s/;
    const fp = source.value.text.slice(0, s?.anchorOffset);
    const first = fp.split(splitter).pop();
    const sp = source.value.text.slice(s?.anchorOffset);
    const last = sp.split(splitter).shift();
    const ext = (first || "") + (last || "");
    console.log(ext);
  }
}
</script>
