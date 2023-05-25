<template>
  <a
    v-if="pathExist"
    class="block cursor-pointer text-dark-font mb-6"
    @click.prevent="$router.go(-1)"
  >
    {{ "<--  " + (routeParse ? "/" : "") + (routeParse || "Main") }}
  </a>
</template>

<script lang="ts" setup>
const $route = useRoute();
const $router = useRouter();

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
