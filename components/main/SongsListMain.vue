<template>
  <div>
    <BackArrowsUi v-if="implementor" class="mb-6" @click="$emits('back')" />
    <UiLoading v-if="loading" />
    <div v-else class="pb-16">
      <div class="text-lg text-light mb-6">Songs</div>
      <ListHoverItemsUi
        v-for="sources in getSources"
        :key="sources.id"
        @click="select(sources)"
      >
        <div>{{ sources.name }}</div>
        <div class="text-sm">
          <span>Implementor:</span>
          <span
            v-for="(impl, implementorInd) in sources.implementors"
            :key="implementorInd"
            >{{ impl.name }}</span
          >
        </div>
      </ListHoverItemsUi>
      <div v-if="getSources.length === 0" class="w-full text-center text-light">
        No Items
      </div>
      <div v-if="isPaginable" class="flex justify-center mt-4">
        <UiPagination
          :current="curPage"
          :total="parseInt(sourcesStore._getSourcesTotal / PAGE_SIZE)"
          @change="changePage"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSourcesStore } from "~/store/sources";

import { ILanguage } from "~/types/languages.types";
import { ISource } from "~/types/sources.types";

const sourcesStore = useSourcesStore();
const $route = useRoute();
const $router = useRouter();
const $localePath = useLocalePath();

const props = defineProps<{
  langs: ILanguage[] | null;
  implementor: string | null;
  filterText: string;
}>();

const $emits = defineEmits(["back", "select"]);

const PAGE_SIZE = ref(5);

const getSources = computed(() => {
  return sourcesStore._getSources;
});
const curPage = computed(() => (Number($route.query.spage) || 1) - 1);
const isPaginable = computed(() => {
  return sourcesStore._getSourcesTotal > PAGE_SIZE.value;
});

watch(
  () => [props.implementor, props.langs, props.filterText],
  () => request()
);

const { loading, request } = useRequestHook(async () => {
  await sourcesStore._fetchSources({
    name: props.filterText,
    langs: props.langs?.map((lang) => lang.id),
    implementor: props.implementor || "",
    isVerified: true,
    offset: curPage.value * PAGE_SIZE.value,
    limit: PAGE_SIZE.value,
  });
});

onMounted(async () => await request());

function changePage(page: number) {
  $router.push({
    path: $localePath($route.path),
    query: { ...($route.query || {}), spage: page + 1 },
  });
}

function select(sources: ISource) {
  $emits("select", sources);
}
</script>
