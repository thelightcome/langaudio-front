<template>
  <nav>
    <ul
      class="flex flex-col justify-start items-start text-light text-left pt-5"
    >
      <li v-for="menuItem in menyList" :key="menuItem.name" class="mb-3">
        <NuxtLink :to="localePath(menuItem.to)">{{ menuItem.name }}</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
const localePath = useLocalePath();

const menyList = ref([
  { to: "/admin/roles", name: "Roles" },
  { to: "/admin/user", name: "User" },
  { to: "/admin/languages", name: "Languages" },
  { to: "/admin/countries", name: "Countries" },
  { to: "/admin/implementors", name: "Implementors" },
  { to: "/admin/sources", name: "Sources" },
  { to: "/admin/sources/add", name: "Add Sources" },
  { to: "/admin/translates", name: "Translates" },
]);
</script>
