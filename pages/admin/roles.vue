<template>
  <div class="pt-4">
    <UiBackSlash :path="$localePath('/admin')" />
    <div class="relative mb-5">
      <p class="mb-4 text-light">Form Add Roles</p>
      <form class="flex items-start gap-4" @submit.prevent="">
        <UiInputField
          v-if="values.value"
          v-model="values.value.value"
          :name="'Role Name'"
          :type="'text'"
          :error="errors.value.value"
          @blur="check('value')"
        />
        <UiTextarea
          v-if="values.description"
          v-model="values.description.value"
          :name="'Role description'"
          :error="errors.description.value"
          @blur="check('description')"
        />
        <UiButton
          :disabled="loading || !isValid"
          @click="handleSubmit($event, request)"
          >Send</UiButton
        >
        <UiButton
          :disabled="loadingUpdate"
          @click="
            requestUpdate({
              value: values.value.value,
              description: values.description.value,
            })
          "
          >Update</UiButton
        >
      </form>
      <div v-show="error">{{ error }}</div>
    </div>
    <div>
      <div
        v-for="role in rolesStore._getRoles"
        :key="role.value"
        class="flex flex-row justify-between items-center"
      >
        <p class="text-light">{{ role.value }}</p>
        <p class="text-light">{{ role.description }}</p>
        <div class="flex flex-row">
          <UiButton @click="selectCurrent(role)">Select</UiButton>
          <UiButton :disabled="loadingDelete" @click="requestDelete(role.value)"
            >Delete</UiButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRolesStore } from "~/store/roles";

import { IRole } from "~/types/roles.types";

const $api = useApiHook();
const rolesStore = useRolesStore();
const $localePath = useLocalePath();
onMounted(async () => {
  await rolesStore._fetchRoles();
});

const { values, errors, isValid, check, handleSubmit, clear } = useFormHook({
  value: { required: true },
  description: { required: true },
});

const { loading, error, request } = useRequestHook(async (data: any) => {
  const sendData = {
    value: data.value.value.toUpperCase(),
    description: data.description.value.toLowerCase(),
  };
  await $api.roles.create(sendData);
  clear();
  await rolesStore._fetchRoles();
});

const selectedRole = ref("");

function selectCurrent(selected: IRole) {
  values.value.value = selected.value;
  values.description.value = selected.description;
  selectedRole.value = selected.value;
}

const { loading: loadingUpdate, request: requestUpdate } = useRequestHook(
  async (role: IRole) => {
    if (!selectedRole.value) return;
    await $api.roles.update(selectedRole.value, role);
    selectedRole.value = "";
    await rolesStore._fetchRoles();
  }
);

const { loading: loadingDelete, request: requestDelete } = useRequestHook(
  async (value: string) => {
    await $api.roles.delete(value);
    await rolesStore._fetchRoles();
  }
);
</script>
