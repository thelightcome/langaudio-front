<template>
  <SourceItemPlay :source="source" @back="$emits('back')" />
</template>

<script lang="ts" setup>
import { useSourcesStore } from "~/store/sources";

const sourcesStore = useSourcesStore();

const props = defineProps<{
  sourceId: string;
}>();

const $emits = defineEmits(["back"]);

const source = computed(() => {
  return sourcesStore._getSources.find((s) => s.id === +props.sourceId);
});
</script>
