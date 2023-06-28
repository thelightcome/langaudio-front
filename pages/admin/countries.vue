<template>
  <div class="pt-4">
    <UiBackSlash :path="$localePath('/admin')" />
    <div class="relative mb-5">
      <p class="mb-4 text-light">Form Add Countries</p>
      <form class="flex items-center" @submit.prevent="">
        <UiInputField
          v-if="values.name"
          v-model="values.name.value"
          :name="'Country Name'"
          :type="'text'"
          :error="errors.name.value"
          class="mb-6"
          @blur="check('name')"
        />
        <UiButton
          :disabled="loading || !isValid"
          @click="handleSubmit($event, request)"
          >Send</UiButton
        >
        <UiButton
          :disabled="loadingUpdate"
          @click="requestUpdate(values.name.value)"
          >Update</UiButton
        >
      </form>
      <div v-show="error">{{ error }}</div>
    </div>
    <div>
      <div
        v-for="country in countryStore._getCountries"
        :key="country.name"
        class="flex flex-row justify-between items-center"
      >
        <p class="text-light">{{ country.name }}</p>
        <div class="flex flex-row">
          <UiButton @click="selectCurrent(country.name)">Select</UiButton>
          <UiButton
            :disabled="loadingDelete"
            @click="requestDelete(country.name)"
            >Delete</UiButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCountryStore } from "~/store/countries";

const $api = useApiHook();
const $localePath = useLocalePath();
const countryStore = useCountryStore();
onMounted(async () => {
  await countryStore._fetchCountries();
});

const { values, errors, isValid, check, handleSubmit, clear } = useFormHook({
  name: { required: true },
});

const { loading, error, request } = useRequestHook(async (data: any) => {
  const sendData = {
    name: data.name.value.toLowerCase(),
  };
  await $api.country.create(sendData);
  clear();
  await countryStore._fetchCountries();
});

const selectedCountry = ref("");

function selectCurrent(name: string) {
  values.name.value = name;
  selectedCountry.value = name;
}

const { loading: loadingUpdate, request: requestUpdate } = useRequestHook(
  async (name: string) => {
    if (!selectedCountry.value) return;
    await $api.country.update(selectedCountry.value, { name });
    selectedCountry.value = "";
    await countryStore._fetchCountries();
  }
);

const { loading: loadingDelete, request: requestDelete } = useRequestHook(
  async (name: string) => {
    await $api.country.delete(name);
    await countryStore._fetchCountries();
  }
);
</script>
