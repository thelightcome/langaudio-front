<template>
  <UiDropDown>
    <template #trigger>
      <UiButton type="text" class="py-2 px-3">{{ curValue?.name }}</UiButton>
    </template>
    <template #body>
      <div class="flex flex-col items-strech">
        <UiButton
          v-for="typeItem in types"
          :key="typeItem.name"
          type="text"
          class="py-2 px-3"
          @click="select(typeItem.value)"
          >{{ typeItem.name }}</UiButton
        >
      </div>
    </template>
  </UiDropDown>
</template>

<script lang="ts" setup>
const types = reactive([
  { name: "All", value: null },
  { name: "Verified", value: true },
  { name: "Not Verified", value: false },
]);
const props = defineProps<{
  modelValue: null | boolean;
}>();
const emits = defineEmits(["update:modelValue"]);
const curValue = computed(() => {
  return types.find((e) => e.value === props.modelValue);
});
function select(value: null | boolean) {
  emits("update:modelValue", value);
}
</script>
