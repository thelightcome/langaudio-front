<template>
  <SelectUi
    :model-value="modelValue"
    :label="'Country'"
    :options="countries"
    :field="'name'"
    :multiple="multiple"
    @update:model-value="select($event)"
  />
</template>

<script lang="ts" setup>
import { useCountryStore } from "~/store/countries";

import { ICountry } from "~/types/countries.types";

const countryStore = useCountryStore();

withDefaults(
  defineProps<{
    multiple?: boolean;
    modelValue: ICountry[] | null;
  }>(),
  {
    multiple: true,
  }
);

const emits = defineEmits(["update:modelValue"]);

const countries = computed(() => {
  return countryStore._getCountries;
});

onMounted(() => {
  countryStore._fetchCountries();
});

function select(countries: any[]) {
  emits("update:modelValue", countries);
}
</script>
