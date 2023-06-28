<template>
  <div class="inline-flex justify-between items-stretch gap-2">
    <UiButton
      v-for="ind in count"
      :key="ind"
      type="text"
      class="w-9 h-9 border border-gray-300"
      :class="{
        [current + 1 === ind ? 'border-gray-200' : 'border-transparent']: true,
      }"
      @click="change(ind)"
      >{{ ind }}</UiButton
    >
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    current: number;
    total: number;
  }>(),
  {
    current: 0,
    total: 10,
  }
);

const emits = defineEmits(["change"]);

const count = computed<number[]>(() => {
  return calculatePages(props.current + 1, props.total);
});

function change(n: number) {
  emits("change", n - 1);
}

function calculatePages(
  current = 1,
  total = 1,
  limit = 4,
  expand = 1
): number[] {
  if (total === 1) return [];
  if (current > total) current = total;
  limit = limit < total ? limit : total;
  expand = limit - 2 * expand < 3 ? 0 : expand;
  let arr = getArrayNumber(1, expand);
  const endPagin = getArrayNumber(total - expand + 1, expand);
  limit = limit - arr.length - endPagin.length;
  let start = current - 1 > (arr.length || 1) ? current - 1 : arr.length + 1;
  const end = endPagin[0] - 1 || total;
  if (start + (limit - 1) >= end) {
    start = end - limit + 1;
  }
  arr = arr.concat(getArrayNumber(start, limit));
  arr = arr.concat(endPagin);
  return arr;
}

function getArrayNumber(start: number, count: number): number[] {
  const arr = [];
  for (let i = start; i < start + count; i++) {
    arr.push(i);
  }
  return arr;
}
</script>
