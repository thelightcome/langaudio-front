<template>
  <div
    class="md:min-w-[300px] min-h-[260px] flex flex-col justify-start items-center bg-bg-main p-6 text-dark-font"
  >
    <div class="flex flex-col justify-center items-center gap-y-2 mb-2">
      <UiInputField
        v-if="plValues.name"
        v-model="plValues.name.value"
        :name="'New Playlist'"
        :type="'text'"
        class="text-light-font"
      />
      <UiButton
        :disabled="plLoading || !plIsValid"
        type="text"
        class="py-1 px-4"
        @click="handleNewPlaylistSubmit"
      >
        Add</UiButton
      >
    </div>
    <div class="border border-light-300 p-5 rounded-md">
      <div class="flex flex-col justify-center items-center gap-y-2 mb-2">
        <UiInputField
          v-if="values.search"
          v-model="values.search.value"
          :name="'Search'"
          :type="'search'"
          class="text-light-font"
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
      <template v-if="playlists.list.length">
        <div
          v-for="playlist in playlists.list"
          :key="playlist.id"
          class="p-2 cursor-pointer duration-300 hover:bg-indigo-600/50"
          @click="addToPlaylist(playlist.id)"
        >
          {{ playlist.name }}
        </div>
      </template>
      <template v-else>
        <div class="text-center">No Playlists</div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ISource } from "~/types/sources.types";
import { IPlaylistShort } from "~/types/playlists.types";
import { useModalStore } from "~/store/modal";

const modalStore = useModalStore();
const $api = useApiHook();

const props = withDefaults(
  defineProps<{
    data: ISource;
  }>(),
  {}
);

const { values: plValues, isValid: plIsValid } = useFormHook({
  name: { init: "", min: 1 },
});

const { loading: plLoading, request: plRequest } = useRequestHook(async () => {
  await $api.playlist.create({
    name: plValues.name.value,
  });
  plValues.name.value = "";
  values.search.value = "";
  request();
});

const playlistCount = ref(0);
const playlists = reactive<{ list: IPlaylistShort[] }>({ list: [] });

function handleNewPlaylistSubmit() {
  plRequest();
}

const { values, isValid } = useFormHook({
  search: { init: "", min: 1 },
});

const { loading, request } = useRequestHook(async () => {
  const response = await $api.playlist.findAll({
    name: values.search.value,
    offset: playlists.list.length,
    limit: 10,
    fields: ["id", "name"],
  });
  playlistCount.value = response.count;
  playlists.list.push(...response.rows);
});

function handleSearchSubmit() {
  playlists.list = [];
  request();
}

function addToPlaylist(plId: number) {
  $api.playlist.addToPlaylist({
    plId,
    sourceId: props.data.id,
  });
  modalStore._close();
}

onMounted(async () => {
  await request();
});
</script>
