<template>
  <div>
    <UiBackSlash />
    <div class="flex justify-start items-start flex-wrap gap-4 mb-4">
      <div
        v-if="curSource"
        class="grow border border-light-300 py-3 px-5 w-full md:max-w-[45%]"
      >
        <div class="flex items-stretch mb-5 gap-3">
          <button
            v-if="curSource.srcYoutube"
            class="flex justify-center items-center w-8 h-8 border-none cursor-pointer rounded-xl duration-300 p-2 hover:bg-gray-200/20"
            :class="{ 'bg-gray-200/20': curPlayerType === 'youtube' }"
            @click="curPlayerType = 'youtube'"
          >
            <IconYoutube class="fill-red-500" />
          </button>
          <button
            v-if="curSource.srcAudio"
            class="flex justify-center items-center w-8 h-8 border-none cursor-pointer rounded-xl duration-300 p-2 hover:bg-gray-200/20"
            :class="{ 'bg-gray-200/20': curPlayerType === 'audio' }"
            @click="curPlayerType = 'audio'"
          >
            <IconHeadphones class="fill-pink-600" />
          </button>
          <button
            v-if="curSource.srcVideo"
            class="flex justify-center items-center w-8 h-8 border-none cursor-pointer rounded-xl duration-300 p-2 hover:bg-gray-200/20"
            :class="{ 'bg-gray-200/20': curPlayerType === 'video' }"
            @click="curPlayerType = 'video'"
          >
            <IconVideoCamera class="fill-fuchsia-700" />
          </button>
        </div>
        <div class="w-full">
          <iframe
            v-if="curSource.srcYoutube"
            v-show="curPlayerType === 'youtube'"
            type="text/html"
            width="400"
            height="300"
            :src="curSource.srcYoutube"
            frameborder="0"
            class="w-full"
          ></iframe>
          <UiVideo
            v-if="curSource.srcAudio"
            v-show="curPlayerType === 'audio'"
            :src="curSource.srcAudio"
            :video="false"
          />
          <UiVideo
            v-if="curSource.srcVideo"
            v-show="curPlayerType === 'video'"
            :src="curSource.srcVideo"
            class="w-full"
          />
        </div>
      </div>
      <div
        class="border border-light-300 py-3 px-5 mb-4 text-dark-font w-full md:max-w-[50%]"
      >
        <div>{{ plName }}</div>
        <UiScrollLoading
          :loading="loading"
          :can-load="isPaginable"
          class="h-[150px]"
          @load="load"
        >
          <div
            v-for="source in sources.list"
            :key="source.id"
            class="p-2 cursor-pointer duration-300 hover:bg-gray-200/30"
            @click="selectSource(source)"
          >
            {{ source.implementors[0].name }} - {{ source.name }}
          </div>
        </UiScrollLoading>
        <div v-if="!sources.list.length">Empty playlist</div>
      </div>
    </div>
    <div v-if="curSource">
      <div class="border border-light-300 py-3 px-5 mb-4 w-full">
        <UiText class="mb-2">Settings</UiText>
        <div class="flex items-end mb-3">
          <MainSelectLangs v-model="selectedLang" class="max-w-[200px] mr-2" />
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
            :source="curSource"
            :lang="selectedLang"
            class="max-w-[250px]"
          />
          <NuxtLink
            :to="localePath('/translates/' + curSource.id)"
            class="text-dark-font flex items-center align-middle leading-none"
            alt="Add Translate"
            ><span class="text-3xl mr-2 align-middle leading-none">+</span> Add
            Your Translate</NuxtLink
          >
        </div>
      </div>
      <div>
        <div class="flex justify-between items-center md:pr-[10%] mb-4">
          <UiText level="h5"
            >{{ curSource.implementors[0].name }} - {{ curSource.name }}</UiText
          >
          <UiButton type="text" class="ml-3" @click="removeFromPlaylist"
            >Remove From Playlist</UiButton
          >
        </div>
        <UiText @click="clickText">
          <div v-html="sourceText"></div>
        </UiText>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconYoutube from "~/assets/icons/youtube.svg?component";
import IconHeadphones from "~/assets/icons/headphones.svg?component";
import IconVideoCamera from "~/assets/icons/video-camera.svg?component";

import { ILanguage } from "~/types/languages.types";
import { ISource } from "~/types/sources.types";

definePageMeta({
  middleware: ["auth-middleware"],
});

const route = useRoute();
const localePath = useLocalePath();

const $api = useApiHook();
const PAGE_SIZE = ref(10);
const sourceCount = ref(0);
const plName = ref("");
const sources = reactive<{ list: ISource[] }>({
  list: [],
});
const curSource = ref<null | ISource>(null);
const selectedLang = ref<ILanguage | null>(null);
const curPlayerType = ref("youtube");
const splitChar = ref(" ");
const selectedTranslate = ref(null);

const sourceText: ComputedRef<string> = computed(() => {
  return curSource.value ? curSource.value.text.replaceAll("\n", "<br />") : "";
});

const isPaginable = computed(() => {
  return sources.list.length ? sourceCount.value > PAGE_SIZE.value : true;
});

const { loading, request } = useRequestHook(async () => {
  plName.value = decodeURI(route.params.name as string);
  const response = await $api.source.findPlaylistSources(plName.value, {
    offset: sources.list.length,
    limit: PAGE_SIZE.value,
  });
  const playNumber = sources.list.length;
  sourceCount.value = response.count;
  sources.list.push(...response.rows);
  if (sources.list[playNumber]) curSource.value = sources.list[playNumber];
});

function load() {
  request();
}

function selectSource(source: ISource) {
  curSource.value = source;
}

function clickText() {
  if (!curSource.value) return;
  if (splitChar.value === "-") return;
  const s = window.getSelection();
  if (s?.anchorOffset) {
    const splitter = splitChar.value === "\n" ? "\n" : /\s/;
    const fp = curSource.value.text.slice(0, s?.anchorOffset);
    const first = fp.split(splitter).pop();
    const sp = curSource.value.text.slice(s?.anchorOffset);
    const last = sp.split(splitter).shift();
    const ext = (first || "") + (last || "");
    console.log(ext);
  }
}

function removeFromPlaylist() {
  if (!curSource.value || !plName.value) return;
  $api.playlist.removeFromPlaylist({
    plName: plName.value,
    sourceId: curSource.value.id,
  });
}
</script>
