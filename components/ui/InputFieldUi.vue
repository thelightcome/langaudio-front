<template>
  <label class="block w-full">
    <span v-show="name" class="block mb-2 text-md text-light">{{ name }}</span>
    <input
      :type="props.type"
      :value="modelValue"
      class="relative w-full border-none box-border px-2 py-3 outline-none text-light bg-secondary/50"
      autocomplete="on"
      :placeholder="placeholder"
      @input="change"
      @blur="$emits('blur', $event), (focus = false)"
      @focus="focus = true"
    />
    <div class="w-full h-1 bg-gradient_1"></div>
    <span v-show="error" class="block mt-2 text-xs text-error">{{
      error
    }}</span>
  </label>
</template>

<script lang="ts" setup>
export type TypeInputField = "email" | "password" | "text" | "search";

const props = withDefaults(
  defineProps<{
    name?: string;
    placeholder?: string;
    type: TypeInputField;
    timeout?: number;
    action?: boolean;
    error?: string;
    modelValue?: string;
  }>(),
  {
    name: "",
    placeholder: "Input text",
    timeout: 500,
    action: false,
    error: "",
    modelValue: "",
  }
);

const $emits = defineEmits(["update:modelValue", "blur"]);

const focus = ref<boolean>(false);

const timerId = ref<ReturnType<typeof setTimeout> | null>(null);

function change($event: Event) {
  if (props.action) {
    if (timerId.value) clearTimeout(timerId.value);
    timerId.value = setTimeout(() => {
      $emits("update:modelValue", ($event.target as HTMLInputElement).value);
    }, props.timeout);
  } else {
    $emits("update:modelValue", ($event.target as HTMLInputElement).value);
  }
}
</script>
