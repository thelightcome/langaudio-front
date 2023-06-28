<template>
  <div class="grid gap-4" :style="style">
    <button
      v-for="(head, headInd) in heads"
      :key="headInd"
      class="border-none outline-none cursor-pointer py-4 px-2 duration-300 text-md leading-5"
      :class="{
        'text-light': current !== headInd,
        'bg-light/20 text-primary': current === headInd,
      }"
      @click="click(headInd)"
    >
      {{ label ? head[label] : head }}
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  heads: any[];
  label: string;
  current: number | null;
}>();

const $emits = defineEmits(["select"]);

const style = computed(() => {
  return {
    gridTemplateColumns: `repeat(${props.heads.length}, minmax(0, 1fr))`,
  };
});

function click(ind: number) {
  $emits("select", ind);
}
</script>
