<template>
  <div
    ref="observeParent"
    class="relative w-full overflow-x-hidden scrollbar-sweet"
  >
    <slot></slot>
    <UiLoading
      v-if="loading"
      class="!absolute left-0 bottom-0 right-0 bg-bg-main py-4 z-10"
    />
    <div ref="observeELem"></div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    loading?: boolean;
    canLoad?: boolean;
  }>(),
  {
    canLoad: false,
    loading: false,
  }
);

const emits = defineEmits(["load"]);

const observeParent = ref<HTMLDivElement | null>(null);
const observeELem = ref<HTMLDivElement | null>(null);
let observer = null as IntersectionObserver | null;

function observeFunc() {
  if (!props.loading && props.canLoad) emits("load");
}

onMounted(() => {
  observer = new IntersectionObserver(observeFunc, {
    root: observeParent.value,
    rootMargin: "20px",
    threshold: 1.0,
  });
  observer?.observe(observeELem.value as HTMLElement);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});
</script>
