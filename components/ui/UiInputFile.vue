<template>
  <div
    class="relative inline-flex justify-center items-center box-border overflow-hidden cursor-pointer"
  >
    <template v-if="!props.file">
      <IconAdd class="w-5 h-3 pointer-events-none fill-light" />
      <input
        type="file"
        :accept="accept || 'video/*, audio/*'"
        class="absolute top-0 left-0 z-10 w-full h-full opacity-0 cursor-pointer"
        @change="change($event)"
      />
    </template>
    <UiButton v-else class="w-5 h-5 !px-0 !py-0" @click="clear()"
      ><IconTrash class="w-full h-full"
    /></UiButton>
  </div>
</template>

<script lang="ts" setup>
import IconAdd from "~/assets/icons/add.svg?component";
import IconTrash from "~/assets/icons/trash.svg?component";

const props = defineProps<{
  file: string;
  accept: string;
}>();
const emit = defineEmits(["update"]);

function change(e: Event) {
  const files = (e?.target as HTMLInputElement)?.files;

  if (files && files.length) emit("update", files[0]);
}

function clear() {
  emit("update", null);
}
</script>
