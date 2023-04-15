<template>
  <label class="block w-full">
    <span v-show="name" class="block mb-2 text-md text-dark-font">{{
      name
    }}</span>
    <input
      :type="props.type"
      :value="modelValue"
      class="w-full border-none rounded-md box-border px-3 py-1"
      autocomplete="on"
      @input="change"
      @blur="$emit('blur', $event)"
    />
    <span v-show="error" class="block mt-2 text-xs text-error">{{
      error
    }}</span>
  </label>
</template>

<script lang="ts" setup>
export type TypeInputField = "email" | "password" | "text" | "search";

const props = defineProps<{
  name?: string;
  type: TypeInputField;
  error?: string;
  modelValue?: string;
}>();

const emits = defineEmits(["update:modelValue", "blur"]);

function change($event: Event) {
  emits("update:modelValue", ($event.target as HTMLInputElement).value);
}
</script>
