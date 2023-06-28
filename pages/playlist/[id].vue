<template>
  <div v-if="playlistId !== undefined" class="relative min-h-full pb-16">
    <UiBackSlash :path="$localePath('/playlist')" />
    <div class="text-light mb-4 flex gap-6">
      <span>Playlist Name: </span>
      <span class="text-primary">{{ playlistId }}</span>
    </div>
    <div>
      <UiScrollLoading
        :loading="loading"
        :can-load="sources.length < sourcesTotalCount"
      >
        <div
          v-for="source in sources"
          :key="source.id"
          class="flex justify-between py-1 px-2 pr-5 cursor-pointer duration-300"
          :class="{
            'bg-primary/30': sourceId === source.id,
          }"
          @click="selectSource(source)"
        >
          <div class="text-light flex items-center leading-none">
            <IconPlay
              v-if="sourceId === source.id"
              class="w-2 h-2 transform translate-y-[2px] block fill-light mr-2 leading-none duration-300 hover:fill-primary"
            />
            <div
              v-else
              class="w-2 h-2 rounded-full bg-light mr-2 transform translate-y-[2px]"
            ></div>
            <span>{{ source.name }}</span> - <span>Implementor: </span>
            <span
              v-for="(implementor, implementorInd) in source.implementors"
              :key="implementorInd"
              >{{ implementor.name }}</span
            >
          </div>
          <div>
            <button
              class="border-none bg-transparent px-2"
              @click="removeFromPlaylist(source)"
            >
              <IconTrash class="w-4 h-4 duration-300" />
            </button>
          </div>
        </div>
      </UiScrollLoading>
    </div>
    <transition name="slide-up">
      <SourceItemPlay
        v-if="selectedSource"
        :source="selectedSource"
        @back="selectSource(null)"
        @ended="next"
      />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import IconTrash from "~/assets/icons/trash.svg?component";
import IconPlay from "~/assets/icons/play.svg?component";

import { ISource } from "~/types/sources.types";

const PAGE_SIZE = ref(10);

const $api = useApiHook();
const $route = useRoute();
const $router = useRouter();
const $localePath = useLocalePath();

const sources = ref<ISource[]>([]);
const sourcesTotalCount = ref<number>(0);
const playlistId = computed(() => {
  return +$route.params.id;
});
const sourceId = computed(() => {
  return $route.query.source ? +$route.query.source : null;
});

const selectedSource = computed(() => {
  return sources.value.find((s) => s.id === sourceId.value) || null;
});

const { loading, request } = useRequestHook(async () => {
  if (!playlistId.value) return;
  const { count, rows } = await $api.source.findPlaylistSources(
    playlistId.value,
    {
      offset: sources.value.length,
      limit: PAGE_SIZE.value,
    }
  );

  sources.value.push(...rows);
  sourcesTotalCount.value = count;
});

onMounted(async () => {
  await request();
});

async function removeFromPlaylist(source: ISource) {
  if (!playlistId.value) return;
  await $api.playlist.removeFromPlaylist({
    plId: playlistId.value,
    sourceId: source.id,
  });
  await request();
}

function selectSource(source: ISource | null) {
  $router.push({
    path: $localePath($route.path),
    query: { ...($route.query || {}), source: source ? source.id : null },
  });
}

async function next() {
  const curInd = sources.value.findIndex(
    (c) => c.id === selectedSource.value?.id
  );
  const next = sources.value[curInd + 1];
  if (next) return selectSource(next);
  else if (sources.value.length < sourcesTotalCount.value) {
    await request();
    const next = sources.value[curInd + 1];
    if (next) return selectSource(next);
  }
}
</script>
