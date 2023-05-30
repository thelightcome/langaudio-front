<template>
  <div
    class="pt-10 flex flex-col-reverse md:flex-row justify-between items-start gap-4 flex-wrap"
  >
    <div
      v-if="translateOpt"
      class="fixed top-0 left-0 right-0 bottom-0 z-10"
      @click="translateOpt = null"
    >
      <div
        :style="{ left: translateOpt.x + 'px', top: translateOpt.y + 'px' }"
        class="absolute p-2 border-0 bg-blue-100 text-dark-700 transform translate-y-[10px]"
        @click.prevent=""
      >
        {{ translateOpt.text }}
      </div>
    </div>
    <UiBackSlash />
    <template v-if="source">
      <div class="w-full md:basis-[45%]">
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
        <UiButton type="text" class="mb-3" @click="addToPlaylist"
          >Add To Playlist</UiButton
        >
        <div class="flex gap-5">
          <div>
            <div class="flex justify-between items-center md:pr-[10%] mb-4">
              <UiText level="h5"
                >{{ source.implementors[0].name }} - {{ source.name }}</UiText
              >
            </div>
            <div class="flex gap-2">
              <UiText @dblclick="clickText"
                ><div style="white-space: pre-line" v-html="sourceText"></div
              ></UiText>
            </div>
          </div>
          <div v-if="selectedTranslate">
            <div class="flex justify-between items-center md:pr-[10%] mb-4">
              <UiText level="h5">{{ selectedTranslate.name }}</UiText>
            </div>
            <div class="flex gap-2">
              <UiText
                ><div
                  style="white-space: pre-line"
                  v-html="selectedTranslate.text"
                ></div
              ></UiText>
            </div>
          </div>
        </div>
      </div>
      <div class="grow border border-light-300 py-3 px-5 w-full md:max-w-[45%]">
        <div class="w-full">
          <iframe
            v-if="source.srcYoutube"
            type="text/html"
            width="400"
            height="300"
            :src="source.srcYoutube"
            frameborder="0"
            class="w-full"
          ></iframe>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ITranslateData } from "~/types/translates.types";
import { ILanguage } from "~/types/languages.types";
import { ISource } from "~/types/sources.types";

import { useSourcesStore } from "~/store/sources";
import { useModalStore } from "~/store/modal";

export interface ITransltaOpt {
  x: number;
  y: number;
  text: string;
}

const localePath = useLocalePath();
const $api = useApiHook();
const route = useRoute();
const sourcesStore = useSourcesStore();
const modalStore = useModalStore();
const { locale } = useI18n();

const source: ComputedRef<ISource | undefined> = computed(() => {
  return sourcesStore.sources.find(
    (e: { id: number }) => e.id === +route.params.slug
  );
});

const sourceText: ComputedRef<string> = computed(() => {
  return source.value
    ? source.value.text.split("\n").reduce((acc, el) => {
        const sum = el.split(" ").reduce((acc, el) => {
          acc += `<span>${el} </span>`;
          return acc;
        }, "");
        acc += `<p>${sum}</p>`;
        return acc;
      }, "")
    : "";
});

const selectedLang = ref<ILanguage | null>(null);
const splitChar = ref(" ");
const selectedTranslate = ref<ITranslateData | null>(null);
const translateOpt = ref<ITransltaOpt | null>(null);

function addToPlaylist() {
  modalStore._openModal("MainPlayListModal", source.value);
}

async function clickText(e: any) {
  if (!sourceText.value) return;
  const tag = splitChar.value === "\n" ? "p" : "span";
  const elem = e.target.closest(tag);
  const text = elem.textContent;

  const translate = await $api.googleApi.translate({
    text,
    langCode: selectedLang.value?.code || locale.value,
  });

  translateOpt.value = {
    x: e.clientX,
    y: e.clientY,
    text: translate || "No translation",
  };
}
</script>
