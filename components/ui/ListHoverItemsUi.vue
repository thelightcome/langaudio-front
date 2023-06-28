<template>
  <div
    class="group border-box px-4 py-3 bg-tertiary mb-1 cursor-pointer text-light relative overflow-hidden"
  >
    <slot></slot>
    <div
      class="absolute top-0 right-0 bottom-0 bg-primary duration-300 aspect-square transform translate-x-full group-hover:translate-x-0"
    >
      <IconChevronMain
        class="absolute top-1/2 right-1/2 w-6 h-6 stroke-light fill-transparent transform -translate-y-1/2 opacity-0 -translate-x-full duration-300 delay-200 group-hover:translate-x-1/2 group-hover:opacity-100"
      />
    </div>
  </div>
</template>

<script labg="ts" setup>
import IconChevronMain from "~/assets/icons/chevron-main.svg?component";
</script>
