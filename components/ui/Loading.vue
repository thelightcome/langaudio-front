<template>
  <div class="relative flex justify-center items-center bg-bg-main z-[500]">
    <div class="flex justify-between items-center w-[40%] max-w-[200px]">
      <div
        v-for="number in 7"
        :key="number"
        class="w-[5%] color shadow-md shadow-color-1 border border-color-1 rounded-2xl"
        :style="{
          paddingBottom: Math.max(Math.random() * 60, 25) + '%',
          animationDelay:
            number * Math.floor(option.duration / option.count) + 'ms',
          animationDuration: option.duration + 'ms',
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const option = withDefaults(
  defineProps<{
    count?: number;
    duration?: number;
  }>(),
  {
    count: 7,
    duration: 2000,
  }
);
</script>

<style lang="scss" scoped>
.color {
  animation: color linear infinite;
}

$breakpoints: 7;
$color1: #c00361;
$color2: #310a4f;

@keyframes color {
  0% {
    background-color: $color1;
    opacity: 1;
  }
  @for $i from 1 through $breakpoints {
    $percentage: percentage(calc($i / $breakpoints));
    #{$percentage} {
      background-color: mix($color1, $color2, $percentage);
      opacity: calc(100% - $percentage);
    }
  }
}
</style>
