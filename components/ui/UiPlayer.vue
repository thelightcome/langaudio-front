<template>
  <div>
    <div class="flex items-center mb-2">
      <span class="block text-md text-light mr-5">
        <slot name="title"></slot>
      </span>
      <UiInputFile
        :file="file ? file.name : ''"
        :accept="video ? 'video/mp4,video/x-m4v,video/*' : '.mp3, audio/*'"
        @update="update"
      />
    </div>
    <div class="flex justify-start items-start w-full">
      <UiVideo
        v-if="src && isCanPlay"
        ref="playerNode"
        :src="src"
        :video="video"
        :width="props.width"
        :height="props.height"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    width: string;
    height: string;
    video?: boolean;
  }>(),
  {
    width: "400px",
    height: "300px",
    video: true,
  }
);

const emits = defineEmits(["change"]);

const file = ref<null | File>(null);
const playerNode = ref<null | { $refs: { media: HTMLMediaElement } }>(null);
const src = ref("");

const isCanPlay = computed(() => {
  if (!file.value?.type) return false;

  const CAN_PLAY = playerNode.value?.$refs?.media.canPlayType(
    file.value?.type || ""
  );
  return CAN_PLAY === "maybe" || CAN_PLAY === "probably";
});

watch(
  () => isCanPlay.value,
  () => {
    if (isCanPlay.value && file.value) {
      src.value = URL.createObjectURL(file.value);
      emits("change", file.value);
    }
  }
);

function update(inputFile: File) {
  file.value = inputFile;
}
</script>
