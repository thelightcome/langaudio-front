<template>
  <div class="inline-block">
    <div class="inline-block" @click="toggle(true)">
      <slot name="trigger"></slot>
    </div>

    <ClientOnly>
      <Teleport to="body">
        <div
          v-if="state"
          class="fixed top-0 left-0 right-0 bottom-0 z-[10000] overflow-auto scrollbar-sweet flex justify-center pt-[20%]"
        >
          <div
            class="absolute top-0 left-0 w-full h-full backdrop-blur-sm"
            @click="close()"
          ></div>
          <div
            class="relative inline-block min-w-[300px] min-h-[200px] rounded-xl overflow-hidden"
          >
            <button class="absolute top-0 right-0 z-50" @click="close()">
              <IconClose />
            </button>
            <slot name="body"></slot>
          </div>
        </div>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import IconClose from "~/assets/icons/close.svg?component";

const props = defineProps<{
  currentState?: boolean;
}>();
const emit = defineEmits<{ (e: "close"): void }>();

const { state, toggle } = useToggleHooks(false);

watch(
  () => props.currentState,
  (value: boolean) => {
    if (value !== state.value) toggle(value);
  }
);

function close() {
  toggle(false);
  emit("close");
}
</script>
