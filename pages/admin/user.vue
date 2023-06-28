<template>
  <div class="pt-4">
    <UiBackSlash :path="$localePath('/admin')" />
    <div class="flex justify-start items-end flex-wrap gap-6 mb-6">
      <MainSelectRoles
        v-model="values.selectedRole.value"
        class="max-w-[300px]"
      ></MainSelectRoles>
      <UiInputField
        v-if="values.email"
        v-model="values.email.value"
        :name="'Email'"
        :type="'text'"
        class="max-w-[600px]"
      />
      <UiButton
        class="!px-2 !py-1"
        :disabled="loading"
        @click="handleSubmit($event, searchRequest)"
        >Send</UiButton
      >
    </div>
    <div>
      <div
        v-for="user in users.list"
        :key="user.id"
        class="flex flex-row justify-between items-center"
      >
        <p class="text-light">{{ user.email }}</p>
        <div class="flex flex-row">
          <UiDropDown>
            <template #trigger>
              <UiButton>Roles</UiButton>
            </template>
            <template #body>
              <div
                v-for="role in roles"
                :key="role.id"
                class="text-light cursor-pointer"
                :class="{ '!text-primary': roleActive(user, role.value) }"
                @click="toggleRole(user.id, role.value)"
              >
                {{ role.value }}
              </div>
            </template>
          </UiDropDown>
          <UiButton @click="deleteUser(user.id)">Delete</UiButton>
        </div>
      </div>
    </div>
    <div v-if="isPaginable" class="flex justify-center">
      <UiPagination
        :current="curPage"
        :total="totalCount / PAGE_SIZE"
        @change="changePage"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IUsers } from "~/types/users.types";

const $api = useApiHook();
const rolesStore = useRolesStore();
const $localePath = useLocalePath();

const PAGE_SIZE = ref(10);
const curPage = ref(0);
const totalCount = ref(0);

const { values, handleSubmit } = useFormHook({
  email: { init: "" },
  selectedRole: { init: null },
});

const users = reactive<{ list: IUsers[] }>({
  list: [],
});
const roles = computed(() => {
  return rolesStore._getRoles;
});

const isPaginable = computed(() => {
  return totalCount.value > PAGE_SIZE.value;
});

onMounted(() => request());

const { loading, request } = useRequestHook(async () => {
  const search = {
    email: values.email.value,
    role: values.selectedRole.value?.value || "",
    offset: curPage.value * PAGE_SIZE.value,
    limit: PAGE_SIZE.value,
  };
  const response = await $api.users.findAll(search);
  totalCount.value = response.count;
  users.list = response.rows;
});

function changePage(page: number) {
  curPage.value = page;
  request();
}

function roleActive(user: IUsers, role: string) {
  return user.roles.some((e) => e.value === role);
}

function searchRequest() {
  curPage.value = 0;
  request();
}

async function deleteUser(userId: string) {
  await $api.users.delete(userId);
  request();
}

async function toggleRole(userId: string, value: string) {
  await $api.users.toggleRole(userId, value);
  request();
}
</script>
