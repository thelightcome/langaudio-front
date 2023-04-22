<template>
  <button
    :class="getClasses"
    class="disabled:opacity-75 disabled:cursor-not-allowed"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
export type TypeInputField = "normal" | "text";

const props = withDefaults(
  defineProps<{
    type?: TypeInputField;
    disabled?: boolean;
  }>(),
  {
    type: "normal",
    disabled: false,
  }
);

const CLASSES: { [key in TypeInputField]: string } = {
  normal:
    "flex justify-center items-center rounded-xl border-none box-border py-3 px-6 text-dark-font text-center uppercase",
  text: "text-dark-font",
};

const getClasses = computed(() => {
  return CLASSES[props.type];
});
</script>
