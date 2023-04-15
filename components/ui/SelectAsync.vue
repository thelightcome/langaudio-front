<template>
  <div v-click-outside="close" class="relative block w-full">
    <div class="w-full" @click="toggle()">
      <span v-show="props.title" class="block mb-2 text-md text-dark-font">{{
        props.title
      }}</span>
      <button
        class="w-full box-border border-dark-font text-dark-font px-3 py-1 border cursor-pointer rounded-md duration-300"
        :class="{ 'rounded-bl-none rounded-br-none': state }"
      >
        {{ value || "none" }}
      </button>
    </div>
    <span v-show="!state && error" class="block mt-2 text-xs text-error">{{
      error
    }}</span>
    <transition name="slide-top">
      <div
        v-if="state"
        class="absolute left-0 top-full bg-bg-main text-dark-font border-dark-font border mt-1 min-w-full pb-4 duration-300 min-h-[150px] z-10"
      >
        <UiScrollLoading
          :loading="loading"
          :can-load="canLoad"
          class="h-[150px]"
          @load="emits('load')"
        >
          <ul class="w-full mb-1">
            <li
              class="box-border py-1 px-2 cursor-pointer hover:bg-gray-300/20"
              @click="select(''), close()"
            >
              None
            </li>
            <li
              v-for="(item, itemInd) in props.items"
              :key="itemInd"
              class="box-border py-1 px-2 cursor-pointer hover:bg-gray-300/20"
              @click="select(item), close()"
            >
              {{ item }}
            </li>
          </ul>
        </UiScrollLoading>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    title?: string;
    value: string;
    items: string[];
    error?: string;
    loading?: boolean;
    canLoad?: boolean;
  }>(),
  {
    title: "",
    value: "",
    canLoad: false,
    loading: false,
    error: "",
  }
);

const emits = defineEmits(["select", "load"]);

const { state, toggle } = useToggleHooks(false);

function close() {
  toggle(false);
}

function select(value: string) {
  emits("select", value);
}
</script>
