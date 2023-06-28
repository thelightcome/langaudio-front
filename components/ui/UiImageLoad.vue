<template>
  <div>
    <div class="flex items-center mb-2">
      <span class="block text-md text-light mr-5"> Load Image </span>
      <UiInputFile
        :file="file ? file.name : ''"
        :accept="'image/*, img/*'"
        @update="update"
      />
    </div>
    <div class="flex justify-start items-start w-full">
      <NuxtImg
        v-if="src"
        ref="imgNode"
        class="w-full h-full object-contain"
        :src="src || 'sdvsdv'"
        alt=""
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
const emits = defineEmits(["change"]);

const file = ref<null | File>(null);
const imgNode = ref<null | { $refs: { media: HTMLMediaElement } }>(null);
const src = ref("");

watch(
  () => file.value,
  () => {
    if (file.value) {
      src.value = URL.createObjectURL(file.value);
      emits("change", file.value);
    } else {
      src.value = "";
    }
  }
);

function update(inputFile: File) {
  file.value = inputFile;
}
</script>
