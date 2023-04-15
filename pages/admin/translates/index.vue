<template>
  <div>
    <UiBackSlash />
    <div class="flex justify-start items-start gap-6">
      <MainSelectLangs v-model="selectedLang" class="max-w-[250px]" />
      <MainSearchForm class="w-full" :loading="loading" @submit="submit" />
    </div>
    <div>
      <NuxtLink
        v-for="translate in translates.list"
        :key="translate.id"
        class="flex flex-row justify-between items-center text-dark-font px-2 py-2 cursor-pointer duration-300 hover:text-color-1"
        :to="localePath('/admin/translates/' + translate.id)"
      >
        <p>
          {{ translate.source?.name || "Unlnown" }} -
          {{ translate.source?.implementors[0].name || "Unlnown" }} -
          {{ translate.name }}
        </p>
      </NuxtLink>
    </div>
    <div v-if="isPaginable" class="flex justify-center">
      <UiPagination
        :current="curPage"
        :total="translateCount / PAGE_SIZE"
        @change="changePage"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ILanguage } from "~/types/languages.types";
import { ITranslate } from "~/types/translates.types";

const localePath = useLocalePath();
const $api = useApiHook();

const PAGE_SIZE = ref(10);
const curPage = ref(0);
const translateCount = ref(0);
const impl = ref("");
const song = ref("");
const selectedLang = ref<ILanguage | null>(null);

const translates = reactive<{ list: ITranslate[] }>({
  list: [],
});

const isPaginable = computed(() => {
  return translateCount.value > PAGE_SIZE.value;
});

const { loading, request } = useRequestHook(async () => {
  const response = await $api.translate.findAll({
    langCode: selectedLang.value?.code || "",
    sourceName: song.value,
    sourceImplementor: impl.value,
    offset: curPage.value * PAGE_SIZE.value,
    limit: PAGE_SIZE.value,
    include: ["source"],
  });
  translateCount.value = response.count;
  translates.list.push(...response.rows);
});

function submit(value: { name: string; implementor: string }) {
  translates.list = [];
  impl.value = value.implementor;
  song.value = value.name;
  request();
}

onMounted(() => {
  request();
});

function changePage(page: number) {
  curPage.value = page;
  request();
}
</script>
