<template>
  <div class="w-full pt-12 pb-12">
    <UiBackSlash :path="$localePath('/')" />
    <UiText
      :level="'h2'"
      :component="'h2'"
      class="text-center md:text-left mb-6"
      >Playlists</UiText
    >
    <div class="flex items-center max-w-[720px] mb-4">
      <InputFieldUi
        :model-value="searchText"
        type="search"
        :action="true"
        @update:model-value="setSearchText($event)"
      />
    </div>
    <div>
      <div>
        <ListHoverItemsUi
          v-for="playlist in playlistStore._getPlaylists"
          :key="playlist.id"
          @click="selectPlaylist(playlist)"
        >
          <div>{{ playlist.name }}</div>
          <div class="text-sm">
            <span>Sources count:</span> {{ playlist.sourceCount }}
          </div>
        </ListHoverItemsUi>
      </div>
      <div v-if="isPaginable" class="flex justify-center mt-4 text-light">
        <UiPagination
          :current="curPage"
          :total="playlistStore._getPlaylistsTotal / PAGE_SIZE"
          @change="changePage"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IPlaylist } from "~/types/playlists.types";

definePageMeta({
  middleware: ["auth-middleware"],
});

const $router = useRouter();
const $route = useRoute();
const $localePath = useLocalePath();
const playlistStore = usePlaylistStore();

const PAGE_SIZE = ref(5);

const searchText = computed(() =>
  typeof $route.query.searchText === "string" ? $route.query.searchText : ""
);
const curPage = computed(() => (Number($route.query.page) || 1) - 1);

const isPaginable = computed(() => {
  return playlistStore._getPlaylistsTotal > PAGE_SIZE.value;
});

watch(
  () => [searchText.value, curPage.value],
  () => request()
);

const { request } = useRequestHook(async () => {
  await playlistStore._fetchPlaylists({
    name: searchText.value,
    offset: PAGE_SIZE.value * curPage.value,
    limit: PAGE_SIZE.value,
    fields: ["id", "name"],
  });
});

onMounted(async () => {
  await request();
});

function setSearchText(value: string) {
  $router.push({
    path: $localePath($route.path),
    query: { ...($route.query || {}), searchText: value, page: 0 },
  });
}

function changePage(page: number) {
  $router.push({
    path: $localePath($route.path),
    query: { ...($route.query || {}), page: page + 1 },
  });
}

function selectPlaylist(playlist: IPlaylist) {
  $router.push({
    path: $localePath(`/playlist/${playlist.id}`),
  });
}
</script>
