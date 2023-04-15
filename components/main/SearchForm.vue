<template>
  <form class="w-full flex flex-col items-stretch gap-y-6" @submit.prevent="">
    <div class="flex flex-row items-start flex-wrap gap-x-8 gap-y-6 mb-4">
      <UiInputField
        v-if="values.name"
        v-model="values.name.value"
        :name="'Name'"
        :type="'text'"
        class="grow basis-60"
      />
      <UiInputField
        v-if="values.implementor"
        v-model="values.implementor.value"
        :name="'Implementor'"
        :type="'text'"
        class="grow basis-60"
      />
    </div>
    <UiButton
      :disabled="btnDisable"
      type="text"
      class="py-1 px-4"
      @click="handleSubmit"
    >
      Send</UiButton
    >
  </form>
</template>

<script lang="ts" setup>
const props = defineProps<{
  loading: boolean;
}>();

const emits = defineEmits(["submit"]);

const { values } = useFormHook({
  name: { init: "" },
  implementor: { init: "" },
});

const btnDisable = computed(() => {
  return props.loading || !(values.name.value || values.implementor.value);
});

function handleSubmit() {
  emits("submit", {
    name: values.name.value,
    implementor: values.implementor.value,
  });
}
</script>
