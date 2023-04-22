<template>
  <label class="block w-full">
    <span v-show="name" class="block mb-2 text-md text-dark-font">{{
      props.name
    }}</span>
    <textarea
      ref="textarea"
      :value="props.modelValue"
      class="w-full border-none rounded-md box-border px-3 py-1"
      @input="change"
      @keydown="resize"
      @blur="$emit('blur', $event)"
    ></textarea>
    <span v-show="error" class="block mt-2 text-xs text-error">{{
      props.error
    }}</span>
  </label>
</template>

<script lang="ts" setup>
const props = defineProps<{
  name?: string;
  error?: string;
  modelValue?: string;
}>();

const textarea = ref<HTMLTextAreaElement | null>(null);

const emits = defineEmits(["update:modelValue", "blur"]);

onMounted(() => {
  resize();
});

function change($event: Event) {
  emits("update:modelValue", ($event.target as HTMLInputElement).value);
}

function resize() {
  if (textarea.value === null) return;
  if (textarea.value.scrollHeight > textarea.value.clientHeight)
    textarea.value.style.height = textarea.value.scrollHeight + 10 + "px";
}
</script>
