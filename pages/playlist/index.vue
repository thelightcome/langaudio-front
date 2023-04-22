<template>
  <div class="w-full pt-12 pb-12">
    <UiBackSlash />
    <UiText
      :level="'h2'"
      :component="'h2'"
      class="text-center md:text-left mb-6"
      >Playlists</UiText
    >
    <div class="flex items-center max-w-[720px] mb-4">
      <UiInputField
        v-if="values.search"
        v-model="values.search.value"
        :type="'search'"
        class="text-light-font mr-8"
      />
      <UiButton
        :disabled="loading || !isValid"
        type="text"
        class="py-1 px-4"
        @click="handleSearchSubmit"
      >
        Send</UiButton
      >
    </div>
    <div>
      <div
        v-for="playlist in playlists.list"
        :key="playlist.id"
        class="flex justify-start items-start flex-wrap text-dark-font mb-4 box-border border border-light-300 p-2 gap-4 cursor-pointer duration-300 hover:bg-white/10"
        @click="clickPlaylist(playlist.name)"
      >
        <div class="grow w-full sm:max-w-[30%]">
          <NuxtImg
            :src="
              (playlist.sources &&
                playlist.sources.length &&
                playlist.sources[0].img) ||
              'sdvsdvsv'
            "
            class="w-full"
          />
        </div>
        <div>
          <div>{{ playlist.name }}</div>
          <template v-if="playlist.sources && playlist.sources.length">
            <div v-for="source in playlist.sources" :key="source.id">
              {{ source.implementors[0].name }} - {{ source.name }}
            </div>
          </template>
          <template v-else>
            <div>Empty playlist</div>
          </template>
        </div>
      </div>
    </div>
    <div v-if="isPaginable" class="flex justify-center mt-4">
      <UiPagination
        :current="curPage"
        :total="sourcesStore._getSourcesTotal / PAGE_SIZE"
        @change="changePage"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IPlaylist } from "~/types/playlists.types";

definePageMeta({
  middleware: ["auth-middleware"],
});

const localePath = useLocalePath();
const $api = useApiHook();
const router = useRouter();

const PAGE_SIZE = ref(10);
const curPage = ref(0);
const playlistCount = ref(0);

const playlists = reactive<{ list: IPlaylist[] }>({
  list: [],
});

const { values, isValid } = useFormHook({
  search: { init: "", min: 1 },
});

const { loading, request } = useRequestHook(async () => {
  const response = await $api.playlist.findAll({
    name: values.search.value,
    offset: PAGE_SIZE.value * curPage.value,
    limit: PAGE_SIZE.value,
    fields: ["id", "name"],
    include: ["sources"],
  });
  playlistCount.value = response.count;
  playlists.list = response.rows;
});

function handleSearchSubmit() {
  request();
}

onMounted(async () => {
  await request();
});

const sourcesStore = useSourcesStore();

const isPaginable = computed(() => {
  return playlistCount.value > PAGE_SIZE.value;
});

function changePage(page: number) {
  curPage.value = page;
  request();
}

function clickPlaylist(plName: string) {
  router.push(localePath(`/playlist/${encodeURI(plName)}`));
}
</script>
