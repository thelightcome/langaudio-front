<template>
  <div class="pt-4">
    <UiBackSlash />
    <div class="relative mb-5">
      <p class="mb-4 text-dark-font">Form Add Implementors</p>
      <form class="flex items-center" @submit.prevent="">
        <UiInputField
          v-if="values.name"
          v-model="values.name.value"
          :name="'Implementor'"
          :type="'text'"
          :error="errors.name.value"
          class="mr-4"
          @blur="check('name')"
        />
        <MainSelectCountries v-model="values.countryName.value" />
        <UiButton
          :disabled="loading || !isValid"
          @click="handleSubmit($event, request)"
          >Send</UiButton
        >
        <UiButton :disabled="loadingUpdate" @click="requestUpdate"
          >Update</UiButton
        >
      </form>
      <div v-show="error">{{ error }}</div>
    </div>
    <div>
      <MainFilterVerifyType v-model="isVerified" />
      <div
        v-for="implementor in implementorStore._getImplementors"
        :key="implementor.name"
        class="flex flex-row justify-between items-center"
      >
        <p class="text-dark-font">{{ implementor.name }}</p>
        <div class="flex flex-row">
          <UiButton @click="selectCurrent(implementor)">Select</UiButton>
          <UiButton
            :disabled="loadingDelete"
            @click="requestDelete(implementor)"
            >Delete</UiButton
          >
        </div>
      </div>
    </div>
    <div v-if="isPaginable" class="flex justify-center">
      <UiPagination
        :current="curPage"
        :total="implementorStore._getImplementorsTotal / PAGE_SIZE"
        @change="changePage"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useImplementorStore } from "~/store/implementors";

import { IImplementor, IImplementorCreate } from "~/types/implementors.types";

const PAGE_SIZE = ref(10);

const $api = useApiHook();
const implementorStore = useImplementorStore();
const curPage = ref(0);
const isVerified = ref<null | boolean>(null);
const isPaginable = computed(() => {
  return implementorStore._getImplementorsTotal > PAGE_SIZE.value;
});
onMounted(fetchImplementors);
async function fetchImplementors() {
  await implementorStore._fetchImplementors({
    ...(isVerified.value !== null && { isVerified: isVerified.value }),
    offset: curPage.value * PAGE_SIZE.value,
    limit: PAGE_SIZE.value,
  });
}

watch(
  () => isVerified.value,
  () => {
    changePage(0);
  }
);

function changePage(page: number) {
  curPage.value = page;
  fetchImplementors();
}

const { values, errors, isValid, check, handleSubmit, clear } = useFormHook({
  name: { init: "", required: true, min: 1 },
  countryName: { init: { name: "" }, required: true },
});

const { loading, error, request } = useRequestHook(async (data: any) => {
  const sendData = {
    name: data.name.value.toLowerCase(),
    countryName: data.countryName.value.name.toLowerCase(),
  };
  await $api.implementor.create(sendData);
  clear();
  if (curPage.value === 0) await fetchImplementors();
});

const selectedImplementor = ref<number | null>(null);

function selectCurrent(implementor: IImplementor) {
  values.name.value = implementor.name;
  values.countryName.value = { name: implementor.countryName };
  selectedImplementor.value = implementor.id;
}

const { loading: loadingUpdate, request: requestUpdate } = useRequestHook(
  async () => {
    if (selectedImplementor.value === null) return;
    const implementor: IImplementorCreate = {
      name: values.name.value.toLowerCase(),
      countryName: values.countryName.value.name.toLowerCase(),
    };
    await $api.implementor.verify(selectedImplementor.value, implementor);
    selectedImplementor.value = null;
    clear();
    fetchImplementors();
  }
);

const { loading: loadingDelete, request: requestDelete } = useRequestHook(
  async (implementor: IImplementor) => {
    await $api.implementor.delete(implementor.id);
    fetchImplementors();
  }
);
</script>
