<template>
  <UiModal :current-state="!!modalStore._getType" @close="modalStore._close()">
    <template #body>
      <component
        :is="componentName"
        v-if="componentName"
        :data="modalStore._getData"
        @close-modal="modalStore._close()"
      ></component>
    </template>
  </UiModal>
</template>

<script lang="ts" setup>
import { useModalStore } from "~/store/modal";

const modalStore = useModalStore();

const types = {
  // example: resolveComponent('example'),
  ModalSuccess: resolveComponent("ModalSuccess"),
  MainPlayListModal: resolveComponent("MainPlayListModal"),
};

const componentName = computed(() => {
  return types[modalStore._getType as keyof typeof types];
});
</script>
