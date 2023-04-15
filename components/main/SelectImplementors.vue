<template>
  <UiSelectAsync
    :loading="loading"
    :value="modelValue?.name"
    :title="'Implementors'"
    :items="items"
    :error="error"
    :can-load="canLoad"
    @load="request"
    @select="select"
  />
</template>

<script lang="ts" setup>
import { ICountry } from "~/types/countries.types";
import { IImplementor } from "~/types/implementors.types";

const props = defineProps<{
  country: ICountry | null;
  modelValue: IImplementor | null;
  error?: string;
}>();

const emits = defineEmits(["update:modelValue"]);

const $api = useApiHook();

const implsCount = ref(0);
const impls = reactive<{ list: IImplementor[] }>({
  list: [],
});

const items = computed(() => {
  return impls.list.map((e) => e.name);
});

const canLoad = computed(() => {
  return impls.list.length === 0 || impls.list.length < implsCount.value;
});

watch(
  () => props.country,
  () => {
    impls.list = [];
  }
);

const { loading, request } = useRequestHook(async () => {
  const response = await $api.implementor.findAll({
    countryName: props.country?.name,
    isVerified: true,
    offset: impls.list.length,
    limit: 10,
  });
  implsCount.value = response.count;
  impls.list.push(...response.rows);
});

function select(v: string) {
  const impl = impls.list.find((e) => e.name === v);
  emits("update:modelValue", impl);
}
</script>
