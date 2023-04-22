<template>
  <div v-click-outside="close" class="relative inline-block text-dark-font">
    <button
      class="flex items-center min-w-[40px] h-6 px-2 cursor-pointer btn btn-primary capitalize whitespace-nowrap"
      @click="toggle()"
    >
      <IconWorld class="w-4 h-4 fill-white mr-2" />
      {{ getCurrentLangCode }}
    </button>
    <div
      class="absolute top-7 right-0 z-50 min-w-full max-h-24 py-2 px-4 border border-light-300 flex flex-col items-stretch gap-y-0.5 overflow-x-hidden overflow-y-auto duration-300 scrollbar-sweet bg-bg-main"
      :class="{
        'opacity-100 translate-y-0': state,
        'pointer-events-none opacity-0 translate-y-3': !state,
      }"
    >
      <button
        v-for="lang in locales"
        :key="lang.code"
        class="min-w-full h-6 cursor-pointer btn btn-primary capitalize whitespace-nowrap text-right"
        :class="{ underline: lang.code === getCurrentLangCode }"
        @click="setLocale(lang.code), close()"
      >
        {{ lang.name }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconWorld from "~/assets/icons/world.svg?component";

const { state, toggle } = useToggleHooks(false);

function close() {
  toggle(false);
}

const { locale, locales, setLocale } = useI18n();

const getCurrentLangCode = computed(() => {
  return locales.value?.find((i) => {
    return i.code === locale.value;
  }).code;
});
</script>
