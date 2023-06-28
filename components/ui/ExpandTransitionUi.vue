<template>
  <transition
    name="expand"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
  >
    <slot></slot>
  </transition>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    trX?: number;
  }>(),
  {
    trX: 0,
  }
);

function enter(el: Element) {
  const element: HTMLElement = el as unknown as HTMLElement;
  element.style.height = "auto";
  const height = getComputedStyle(element).height;
  element.style.height = "0";
  requestAnimationFrame(() => {
    element.style.height = height;
    element.style.transform = `translateY(${props.trX})`;
  });
}

function afterEnter(el: Element) {
  const element: HTMLElement = el as unknown as HTMLElement;
  element.style.height = "auto";
}

function leave(el: Element) {
  const element: HTMLElement = el as unknown as HTMLElement;
  const height = getComputedStyle(element).height;
  element.style.height = height;
  element.style.transform = "";
  requestAnimationFrame(() => {
    element.style.height = "0";
  });
}
</script>
