<template>
  <UiSelectAsync
    :value="modelValue?.value"
    :title="'Roles'"
    :items="items"
    :error="error"
    @select="select"
  />
</template>

<script lang="ts" setup>
import { IRole } from "~/types/users.types";

defineProps<{
  modelValue: IRole | null;
  error?: string;
}>();

const rolesStore = useRolesStore();

const emits = defineEmits(["update:modelValue"]);

const items = computed(() => {
  return rolesStore._getRoles.map((v) => v.value);
});

onMounted(async () => {
  await rolesStore._fetchRoles();
});

function select(value: string) {
  const role = rolesStore._getRoles.find((e) => e.value === value);
  emits("update:modelValue", role);
}
</script>
