<template>
  <div v-click-outside="close" class="inline-block relative">
    <div @click="toggle()">
      <slot name="trigger"></slot>
    </div>
    <transition name="dropdown">
      <div
        v-show="state"
        class="absolute top-full z-[1000] mt-2 right-0 py-2 px-3 border border-light-300 flex flex-col items-stretch scrollbar-sweet bg-black"
        @click="close"
      >
        <slot name="body"></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
const { state, toggle } = useToggleHooks(false);

function close() {
  toggle(false);
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
