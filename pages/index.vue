<template>
  <div class="w-full pt-12 pb-12">
    <UiBackSlash />
    <div class="mb-10 flex flex-col sm:flex-row gap-7">
      <MainSelectForm
        class="md:min-w-[230px]"
        @fetch-implementor="fetchImplementor"
        @fetch-song="fetchSong"
      />
      <MainSearchForm class="w-full" :loading="loading" @submit="submit" />
    </div>
    <div class="flex flex-col justify-start items-stretch gap-4">
      <template v-if="sourcesStore._getSources.length">
        <NuxtLink
          v-for="item in sourcesStore._getSources"
          :key="item.id"
          :to="localePath('/sources/' + item.id)"
          class="flex flex-col md:flex-row gap-4 justify-start items-stretch border border-dark-font px-4 py-2 rounded-sm duration-300 hover:bg-gray-300/10"
        >
          <NuxtImg v-if="item.img" :src="item.img" class="max-w-[250px]" />
          <div>
            <UiText>{{ item.implementors[0].name + " - " + item.name }}</UiText>
            <UiText>{{ item.text.slice(0, 400) }}</UiText>
          </div>
        </NuxtLink>
      </template>
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
import { useSourcesStore } from "~/store/sources";

const localePath = useLocalePath();
const sourcesStore = useSourcesStore();

const PAGE_SIZE = ref(10);
const curPage = ref(0);
const isPaginable = computed(() => {
  return sourcesStore._getSourcesTotal > PAGE_SIZE.value;
});

const impl = ref("");
const song = ref("");

function fetchImplementor(value: string) {
  song.value = "";
  impl.value = value;
  request();
}

function fetchSong(value: string) {
  impl.value = "";
  song.value = value;
  request();
}

function submit(value: { name: string; implementor: string }) {
  impl.value = value.implementor;
  song.value = value.name;
  request();
}

function changePage(page: number) {
  curPage.value = page;
  request();
}

async function fetchSources() {
  const resOpt = {
    isVerified: true,
    offset: curPage.value * PAGE_SIZE.value,
    limit: PAGE_SIZE.value,
    implementor: impl.value,
    name: song.value,
  };

  await sourcesStore._fetchSources(resOpt);
}

const { loading, request } = useRequestHook(fetchSources);
</script>
