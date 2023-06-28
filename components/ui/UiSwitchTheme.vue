<template>
  <div
    class="inline-flex justify-center items-center w-[20px] h-[20px]"
    @click="toggleState"
  >
    <transition name="fade" mode="out-in">
      <IconSun v-if="toggleFlag" class="block w-full h-full fill-yellow-300" />
      <IconMoon v-else class="block w-[80%] h-[80%] fill-sky-500" />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import IconSun from "~/assets/icons/sun.svg?component";
import IconMoon from "~/assets/icons/moon.svg?component";

import { useMainStore } from "~/store/main";

const mainStore = useMainStore();

const toggleFlag = computed(() => mainStore._getTheme === "light");

function toggleState() {
  mainStore._changeTheme(mainStore._getTheme === "dark" ? "light" : "dark");
}
</script>
