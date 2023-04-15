<template>
  <NuxtLink
    v-if="pathExist"
    :to="'/' + routeParse"
    class="block cursor-pointer text-dark-font mb-6"
  >
    {{ "<--  " + (routeParse ? "/" : "") + (routeParse || "Main") }}
  </NuxtLink>
</template>

<script lang="ts" setup>
const $route = useRoute();

const routeParse = computed(() => {
  let arr = $route.path.split("/");
  if (!Array.isArray(arr)) arr = $route.path.split("\\");
  arr = arr.slice(0, arr.length - 1).filter((_) => _);
  return arr.join("/");
});

const pathExist = computed(() => {
  return $route.path && $route.path !== "/";
});
</script>
