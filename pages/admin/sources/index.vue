<template>
  <div>
    <UiBackSlash :path="$localePath('/admin')" />
    <div>
      <MainFilterVerifyType v-model="isVerified" />
      <NuxtLink
        v-for="source in sourcesStore._getSources"
        :key="source.id"
        class="flex flex-row justify-between items-center text-light px-2 py-2 cursor-pointer duration-300 hover:text-primary"
        :to="$localePath('/admin/sources/' + source.id)"
      >
        <p>{{ source.name }}</p>
        <p>
          <span
            v-for="(implementor, implementorInd) in source.implementors"
            :key="implementorInd"
            >{{ implementor.name }}</span
          >
        </p>
      </NuxtLink>
    </div>
    <div v-if="isPaginable" class="flex justify-center">
      <UiPagination
        :current="curPage"
        :total="parseInt(sourcesStore._getSourcesTotal / PAGE_SIZE)"
        @change="changePage"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSourcesStore } from "~/store/sources";

const $localePath = useLocalePath();

const PAGE_SIZE = ref(10);

const sourcesStore = useSourcesStore();
const curPage = ref(0);
const isVerified = ref<null | boolean>(null);
const isPaginable = computed(() => {
  return sourcesStore._getSourcesTotal > PAGE_SIZE.value;
});
onMounted(fetchSources);
async function fetchSources() {
  await sourcesStore._fetchSources({
    ...(isVerified.value !== null && { isVerified: isVerified.value }),
    offset: curPage.value * PAGE_SIZE.value,
    limit: PAGE_SIZE.value,
  });
}

watch(
  () => isVerified.value,
  () => {
    changePage(0);
  }
);

function changePage(page: number) {
  curPage.value = page;
  fetchSources();
}
</script>
