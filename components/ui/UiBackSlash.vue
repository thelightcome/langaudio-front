<template>
  <a
    v-if="pathExist"
    class="block cursor-pointer text-light mb-6"
    @click.prevent="back"
  >
    {{ "<--  " + (routeParse ? "/" : "") + (routeParse || "Main") }}
  </a>
</template>

<script lang="ts" setup>
const $route = useRoute();
const $router = useRouter();

const props = defineProps<{
  path?: string;
}>();

const routeParse = computed(() => {
  let arr = $route.path.split("/");
  if (!Array.isArray(arr)) arr = $route.path.split("\\");
  arr = arr.slice(0, arr.length - 1).filter((_: any) => _);
  return arr.join("/");
});

const pathExist = computed(() => {
  return $route.path && $route.path !== "/";
});

function back() {
  if (props.path) $router.push(props.path);
  else $router.back();
}
</script>
