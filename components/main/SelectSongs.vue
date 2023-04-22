<template>
  <UiSelectAsync
    :loading="loading"
    :value="modelValue"
    :title="'Songs'"
    :items="songs.list"
    :can-load="canLoad"
    :error="error"
    @load="request"
    @select="select"
  />
</template>

<script lang="ts" setup>
import { ILanguage } from "~/types/languages.types";

const props = defineProps<{
  lang: ILanguage | null;
  modelValue: string;
  error?: string;
}>();

const emits = defineEmits(["update:modelValue"]);

const $api = useApiHook();

const songCount = ref(0);
const songs = reactive<{ list: string[] }>({ list: [] });

const canLoad = computed(() => {
  return songs.list.length === 0 || songs.list.length < songCount.value;
});

watch(
  () => props.lang,
  () => {
    songs.list = [];
  }
);

const { loading, request } = useRequestHook(async () => {
  const response = await $api.source.findAllNames({
    langCode: props.lang?.code,
    offset: songs.list.length,
    limit: 10,
  });
  songCount.value = response.count;
  songs.list.push(...response.rows.map((e: { name: string }) => e.name));
});

function select(value: string) {
  emits("update:modelValue", value);
}
</script>
