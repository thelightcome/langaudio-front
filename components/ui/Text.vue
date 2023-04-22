<template>
  <component
    :is="props.component"
    class="text-dark-font"
    :class="classes[level]"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts" setup>
export type TypeLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "normal";

const props = withDefaults(
  defineProps<{
    level?: TypeLevel;
    component?: string;
  }>(),
  {
    level: "normal",
    component: "p",
  }
);

const classes = reactive({
  h1: "",
  h2: "text-2xl",
  h3: "text-xl",
  h4: "",
  h5: "text-lg",
  h6: "",
  normal: "",
});
</script>
