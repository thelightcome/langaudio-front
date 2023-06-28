<template>
  <div
    class="min-w-[300px] flex flex-col justify-start items-center bg-black p-6"
  >
    <div
      class="w-16 h-16 rounded-full bg-green-400 flex justify-center items-center mb-5"
    >
      <IconChevron class="w-10 h-10 stroke-white" />
    </div>
    <UiText class="mb-6">{{ props.data }}</UiText>
    <UiButton class="min-w-[150px]" @click="close">OK</UiButton>
  </div>
</template>

<script lang="ts" setup>
import IconChevron from "~/assets/icons/chevron.svg?component";

const props = withDefaults(
  defineProps<{
    data?: string;
  }>(),
  {
    data: "",
  }
);

const emits = defineEmits(["closeModal"]);

function close() {
  emits("closeModal");
}
</script>
