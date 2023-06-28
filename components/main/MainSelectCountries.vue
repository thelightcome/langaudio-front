<template>
  <UiSelectAsync
    :value="modelValue?.name"
    :title="'Сountry'"
    :error="error"
    :items="items"
    @select="select"
  />
</template>

<script lang="ts" setup>
import { useCountryStore } from "~/store/countries";

import { ICountry } from "~/types/countries.types";

const countryStore = useCountryStore();

defineProps<{
  modelValue: ICountry | null;
  error?: string;
}>();

const emits = defineEmits(["update:modelValue"]);

const items = computed(() => {
  return countryStore._getCountries.map((v) => v.name);
});

onMounted(async () => {
  await countryStore._fetchCountries();
});

function select(name: string) {
  const country = countryStore._getCountries.find((e) => e.name === name);
  emits("update:modelValue", country);
}
</script>
