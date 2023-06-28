<template>
  <div
    v-if="source"
    class="w-full bg-black left-0 z-100"
    :class="{
      'fixed bottom-0': collapsed,
      'absolute top-0 min-h-full': !collapsed,
    }"
  >
    <div class="flex justify-between items-center">
      <BackArrowsUi v-if="!collapsed" @click="$emits('back')" />
      <button
        v-else
        class="bg-transparent border-none px-3 py-2 cursor-pointer"
        @click="playerControl"
      >
        <IconPlay v-if="!isPlaying" class="w-4 h-4 fill-light" />
        <IconPause v-else class="w-4 h-4 fill-light" />
      </button>
      <div class="flex items-center">
        <button
          class="bg-transparent border-none px-3 py-2 cursor-pointer"
          @click="collapse"
        >
          <span
            class="block duration-300"
            :class="{
              'border-2 border-solid border-light bg-transparent w-6 h-3 border-box hover:border-primary':
                collapsed,
              'w-6 h-1 bg-light hover:bg-primary': !collapsed,
            }"
          ></span>
        </button>
        <button
          v-if="collapsed"
          class="bg-transparent border-none px-3 py-2 cursor-pointer"
          @click="$emits('back')"
        >
          <IconClose class="stroke-light duration-300 hover:stroke-primary" />
        </button>
      </div>
    </div>
    <div class="overflow-hidden" :class="{ 'h-0': collapsed }">
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
      <div class="w-full mb-4">
        <YouTubePlayer
          v-if="source.srcYoutube"
          ref="youTubePlayer"
          :src="source.id + source.srcYoutube"
          class="w-full mb-4"
          @ended="$emits('ended')"
        />
        <div class="mb-4">
          <div class="flex justify-between items-center mb-3 flex gap-4 pr-5">
            <div class="mr-4">
              <button
                v-if="$auth.isLoggedIn.value && false"
                class="w-7 h-7 flex justify-center items-center border-none bg-transparent cursor-pointer"
                title="Playlist"
              >
                <IconList class="w-7 h-7 stroke-light" />
              </button>
              <button
                class="w-7 h-7 flex justify-center items-center border-none bg-transparent cursor-pointer"
                title="Settings"
                @click="settingsActive = !settingsActive"
              >
                <IconSettings
                  class="w-4 h-4 duration-300"
                  :class="{
                    'fill-primary': settingsActive,
                    'fill-light': !settingsActive,
                  }"
                />
              </button>
            </div>
            <UiButton
              v-if="$auth.isLoggedIn.value"
              type="text"
              title="Add To Playlist"
              class="group"
              @click="addToPlaylist"
              ><IconAdd
                class="w-4 h-4 duration-300 fill-light group-hover:fill-primary"
            /></UiButton>
          </div>
          <ExpandTransitionUi>
            <div v-if="settingsActive" class="mb-4 w-full">
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
                    class="text-light px-2 py-1 border-none rounded-sm duration-300 hover:bg-gray-200/10"
                    :class="{
                      'text-red-500 bg-gray-200/10': splitChar === ' ',
                    }"
                    @click="splitChar = ' '"
                  >
                    By word
                  </button>
                  <button
                    class="text-light px-2 py-1 border-none rounded-sm duration-300 hover:bg-gray-200/10"
                    :class="{
                      'text-red-500 bg-gray-200/10': splitChar === '\n',
                    }"
                    @click="splitChar = '\n'"
                  >
                    By sentence
                  </button>
                </div>
              </div>
              <div v-show="selectedLang" class="flex items-end gap-2">
                <MainSelectTranslates
                  v-model="selectedTranslate"
                  :source="source"
                  :lang="selectedLang"
                  class="max-w-[250px]"
                />
                <NuxtLink
                  v-if="$auth.isLoggedIn.value"
                  :to="localePath('/translates/' + source.id)"
                  class="text-light flex items-center align-middle leading-none"
                  alt="Add Translate"
                  ><span class="text-3xl mr-2 align-middle leading-none"
                    >+</span
                  >
                  Add Your Translate</NuxtLink
                >
              </div>
            </div>
          </ExpandTransitionUi>
        </div>
      </div>
      <div class="flex gap-5">
        <div>
          <div class="mb-4">
            <UiText level="h6" class="text-sm">
              <span
                v-for="(implementor, implementorInd) in source.implementors"
                :key="implementorInd"
                >{{ implementor.name }}</span
              >
            </UiText>
            <UiText level="h5"
              >{{ source.name }}
              {{
                selectedTranslate ? " - " + selectedTranslate.name : ""
              }}</UiText
            >
          </div>
          <div @dblclick="clickText">
            <div v-for="(row, rowInd) in sourceText" :key="rowInd">
              <UiText
                class="px-2 py-1 mb-1 origin"
                :class="{
                  'bg-light/20': row.origin.length,
                }"
              >
                <span
                  v-for="(w, wInd) in row.origin"
                  :key="wInd"
                  class="mr-2 origin"
                  >{{ w }}</span
                >
              </UiText>
              <UiText
                v-if="selectedTranslate"
                class="px-2 py-1 mb-1"
                :class="{
                  'bg-primary/40': row.translate.length,
                }"
              >
                <span
                  v-for="(t, tInd) in row.translate"
                  :key="tInd"
                  class="mr-2"
                  >{{ t }}</span
                >
              </UiText>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconSettings from "~/assets/icons/settings.svg?component";
import IconList from "~/assets/icons/list.svg?component";
import IconAdd from "~/assets/icons/add.svg?component";
import IconClose from "~/assets/icons/close.svg?component";
import IconPlay from "~/assets/icons/play.svg?component";
import IconPause from "~/assets/icons/pause.svg?component";

import { useModalStore } from "~/store/modal";

import { ITranslate } from "~/types/translates.types";
import { ILanguage } from "~/types/languages.types";
import { ISource } from "~/types/sources.types";

export interface ITransltaOpt {
  x: number;
  y: number;
  text: string;
}

const localePath = useLocalePath();
const $api = useApiHook();
const modalStore = useModalStore();
const { locale } = useI18n();
const { $auth } = useNuxtApp();

const props = defineProps<{
  source: ISource | undefined;
}>();

const $emits = defineEmits(["back", "ended"]);

const youTubePlayer = ref<any>(null);
const collapsed = ref<boolean>(false);
const selectedLang = ref<ILanguage | null>(null);
const splitChar = ref(" ");
const selectedTranslate = ref<ITranslate | null>(null);
const translateOpt = ref<ITransltaOpt | null>(null);
const settingsActive = ref<boolean>(false);

const isPlaying = computed(() => {
  return youTubePlayer.value?.isPlaying;
});

const sourceText: ComputedRef<
  Array<{ origin: string[]; translate: string[] }>
> = computed(() => {
  if (!props.source) return [];
  const sourceRows = props.source.text.split("\n");
  const translateRows = selectedTranslate.value
    ? selectedTranslate.value.text.split("\n")
    : [];

  const rows =
    translateRows.length > sourceRows.length ? translateRows : sourceRows;
  return rows.map((_, ind) => {
    return {
      origin: sourceRows[ind] ? sourceRows[ind].split(" ") : [],
      translate: translateRows[ind] ? translateRows[ind].split(" ") : [],
    };
  });
});

function addToPlaylist() {
  modalStore._openModal("PlayListModalMain", props.source);
}

async function clickText(e: any) {
  if (!sourceText.value) return;
  const tag = splitChar.value === "\n" ? "p.origin" : "span.origin";
  const elem = e.target.closest(tag);
  const text = elem.textContent;

  const translate = await $api.googleApi.translate({
    text,
    codeiso: selectedLang.value?.codeiso || locale.value,
  });

  translateOpt.value = {
    x: e.clientX,
    y: e.clientY,
    text: translate || "No translation",
  };
}

function collapse() {
  collapsed.value = !collapsed.value;
}

function playerControl() {
  if (youTubePlayer.value?.isPlaying) youTubePlayer.value?.stopVideo();
  else youTubePlayer.value?.playVideo();
}
</script>
